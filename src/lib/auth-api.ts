/**
 * Chamadas de autenticação escritas à mão para o starter funcionar antes do
 * Orval. Depois de `pnpm generate:api`, substitua por `login`, `me` e
 * `userRefreshToken` de `@/api/generated/auth/auth` (mesma assinatura).
 */
import apiClient, { AUTH_ENDPOINTS } from "@/lib/api-client";
import type {
	ApiResponse,
	AuthUser,
	LoginPayload,
	LoginResult,
	RefreshTokenResult,
} from "@/types/auth";

export function login(data: LoginPayload) {
	return apiClient<ApiResponse<LoginResult>>({
		url: AUTH_ENDPOINTS.login,
		method: "POST",
		data,
	});
}

export function me() {
	return apiClient<ApiResponse<AuthUser>>({
		url: AUTH_ENDPOINTS.me,
		method: "GET",
	});
}

export function refreshToken() {
	return apiClient<ApiResponse<RefreshTokenResult>>({
		url: AUTH_ENDPOINTS.refresh,
		method: "POST",
	});
}
