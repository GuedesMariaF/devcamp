import {
	getStoredToken,
	isTokenExpired,
	removeStoredRefreshToken,
	removeStoredToken,
	updateStoredToken,
} from "@/lib/auth";
import { me, refreshToken } from "@/lib/auth-api";
import { usePermissionStore } from "@/stores/permission-store";
import type { AuthUser } from "@/types/auth";

let inflightBootstrap: Promise<AuthUser | null> | null = null;
let cachedSession: { token: string; user: AuthUser } | null = null;

export function clearAuthSessionBootstrapCache(): void {
	cachedSession = null;
}

export async function fetchCurrentUserProfile(): Promise<AuthUser> {
	const response = await me();

	if (response.error || !response.data) {
		throw new Error(response.message || "Erro ao buscar usuário logado");
	}

	const user = response.data;
	usePermissionStore
		.getState()
		.setPermissions(user.permissions ?? [], user.roles ?? []);

	return user;
}

async function loadSessionInternal(): Promise<AuthUser | null> {
	const storedToken = getStoredToken();
	if (!storedToken) {
		cachedSession = null;
		return null;
	}

	if (cachedSession?.token === storedToken) {
		return cachedSession.user;
	}

	if (isTokenExpired(storedToken)) {
		try {
			const response = await refreshToken();
			if (response.error || !response.data) {
				throw new Error(response.message || "Erro ao atualizar token");
			}
			updateStoredToken(response.data.token);
		} catch {
			removeStoredToken();
			removeStoredRefreshToken();
			usePermissionStore.getState().clearPermissions();
			cachedSession = null;
			return null;
		}
	}

	try {
		const user = await fetchCurrentUserProfile();
		const token = getStoredToken();
		if (token) cachedSession = { token, user };
		return user;
	} catch {
		return null;
	}
}

/**
 * Garante sessão a partir do storage (refresh + /me + permissões), sem depender do AuthProvider.
 * Usado em route guards, que podem rodar antes do React montar.
 */
export function bootstrapAuthFromStorage(): Promise<AuthUser | null> {
	if (inflightBootstrap) return inflightBootstrap;

	inflightBootstrap = loadSessionInternal().finally(() => {
		inflightBootstrap = null;
	});

	return inflightBootstrap;
}
