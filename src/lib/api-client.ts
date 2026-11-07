import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import {
	getStoredToken,
	removeStoredRefreshToken,
	removeStoredToken,
	updateStoredToken,
} from "@/lib/auth";
import type { ApiResponse, RefreshTokenResult } from "@/types/auth";
import { env } from "@/utils/env";

export const AUTH_ENDPOINTS = {
	login: "/api/auth/login",
	me: "/api/auth/me",
	refresh: "/api/auth/refresh-token",
	logout: "/api/auth/logout",
} as const;

const axiosInstance: AxiosInstance = axios.create({
	baseURL: env.API_BASE_URL,
	timeout: 30000,
	withCredentials: env.API_WITH_CREDENTIALS,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

type RetryableAxiosConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function notifyRefreshSubscribers(token: string | null) {
	const queue = refreshQueue;
	refreshQueue = [];
	for (const cb of queue) cb(token);
}

async function refreshAccessToken(): Promise<string> {
	const response = await axiosInstance.request<ApiResponse<RefreshTokenResult>>(
		{ url: AUTH_ENDPOINTS.refresh, method: "POST" },
	);

	const token = response?.data?.data?.token;
	if (!token) {
		throw new Error("Resposta inválida no refresh do token");
	}

	updateStoredToken(token);
	return token;
}

axiosInstance.interceptors.request.use((config) => {
	const token = getStoredToken();
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		const originalRequest = error.config as RetryableAxiosConfig | undefined;
		const url = originalRequest?.url ?? "";

		const isAuthRequest =
			url.includes(AUTH_ENDPOINTS.login) ||
			url.includes(AUTH_ENDPOINTS.refresh);

		if (
			isAuthRequest ||
			status !== 401 ||
			!originalRequest ||
			originalRequest._retry ||
			getStoredToken() == null
		) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		// Já existe um refresh em andamento: enfileira e reexecuta depois.
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				refreshQueue.push((token) => {
					if (!token) {
						reject(error);
						return;
					}
					originalRequest.headers.Authorization = `Bearer ${token}`;
					resolve(axiosInstance.request(originalRequest));
				});
			});
		}

		isRefreshing = true;
		try {
			const token = await refreshAccessToken();
			notifyRefreshSubscribers(token);
			originalRequest.headers.Authorization = `Bearer ${token}`;
			return await axiosInstance.request(originalRequest);
		} catch (refreshError) {
			notifyRefreshSubscribers(null);
			removeStoredToken();
			removeStoredRefreshToken();
			window.location.href = "/";
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);

/** Mutator usado pelo Orval (ver `orval.config.ts`). */
export default async function apiClient<TData = unknown, TVariables = unknown>(
	config: AxiosRequestConfig,
	httpClient: AxiosInstance = axiosInstance,
	_variables?: TVariables,
): Promise<TData> {
	const response = await httpClient.request<TData>(config);
	return response.data;
}

export { axiosInstance as apiClientInstance };
