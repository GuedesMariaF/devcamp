/**
 * Tipos de autenticação provisórios.
 * Depois de rodar `pnpm generate:api`, troque pelos models gerados em
 * `@/api/generated/models` (ex.: `UserResource`).
 */
export interface ApiResponse<T> {
	error: boolean;
	message: string;
	data: T;
}

export interface AuthUser {
	id: number | string;
	name: string;
	email: string;
	permissions?: string[];
	roles?: string[];
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResult {
	token: string;
	user?: AuthUser;
}

export interface RefreshTokenResult {
	token: string;
}
