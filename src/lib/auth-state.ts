/**
 * Singleton para acesso imperativo à autenticação (ex: route guards).
 * Registrado pelo AuthProvider no mount.
 */
export interface AuthStateInstance {
	initialize: () => Promise<boolean>;
}

let authInstance: AuthStateInstance | null = null;

export function setAuthInstance(instance: AuthStateInstance | null): void {
	authInstance = instance;
}

export function getAuthState(): AuthStateInstance | null {
	return authInstance;
}
