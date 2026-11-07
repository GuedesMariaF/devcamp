import * as React from "react";
import { toast } from "sonner";
import {
	getStoredToken,
	isTokenExpired,
	removeStoredRefreshToken,
	removeStoredToken,
	setStoredToken,
} from "@/lib/auth";
import { login } from "@/lib/auth-api";
import {
	bootstrapAuthFromStorage,
	clearAuthSessionBootstrapCache,
	fetchCurrentUserProfile,
} from "@/lib/auth-session";
import { setAuthInstance } from "@/lib/auth-state";
import { usePermissionStore } from "@/stores/permission-store";
import type { AuthUser, LoginPayload } from "@/types/auth";

export interface AuthContextValue {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	signIn: (payload: LoginPayload & { remember?: boolean }) => Promise<void>;
	signOut: () => void;
	hydrateUser: () => Promise<AuthUser>;
	initialize: () => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
	undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<AuthUser | null>(null);
	const [token, setToken] = React.useState<string | null>(() =>
		getStoredToken(),
	);
	const [isLoading, setIsLoading] = React.useState(Boolean(getStoredToken()));
	const isInitializingRef = React.useRef(false);

	const hydrateUser = React.useCallback(async () => {
		const userData = await fetchCurrentUserProfile();
		setUser(userData);
		return userData;
	}, []);

	const signOut = React.useCallback(() => {
		clearAuthSessionBootstrapCache();
		removeStoredToken();
		removeStoredRefreshToken();
		usePermissionStore.getState().clearPermissions();
		setUser(null);
		setToken(null);
	}, []);

	const initialize = React.useCallback(async (): Promise<boolean> => {
		if (isInitializingRef.current) return Boolean(getStoredToken());

		const storedToken = getStoredToken();
		if (!storedToken) {
			setToken(null);
			setUser(null);
			setIsLoading(false);
			return false;
		}

		if (user && !isTokenExpired(storedToken)) return true;

		isInitializingRef.current = true;
		setToken(storedToken);
		setIsLoading(true);

		try {
			const loadedUser = await bootstrapAuthFromStorage();
			if (loadedUser) {
				setUser(loadedUser);
				setToken(getStoredToken());
				return true;
			}
			if (!getStoredToken()) signOut();
			return false;
		} finally {
			setIsLoading(false);
			isInitializingRef.current = false;
		}
	}, [user, signOut]);

	React.useEffect(() => {
		setAuthInstance({ initialize });
		return () => setAuthInstance(null);
	}, [initialize]);

	const signIn = React.useCallback(
		async ({
			remember = true,
			...payload
		}: LoginPayload & { remember?: boolean }) => {
			setIsLoading(true);
			try {
				const response = await login(payload);
				if (response.error || !response.data) {
					throw new Error(response.message || "Erro ao realizar login");
				}

				setStoredToken(response.data.token, { remember });
				setToken(response.data.token);
				await hydrateUser();
				toast.success(response.message || "Login realizado com sucesso");
			} finally {
				setIsLoading(false);
			}
		},
		[hydrateUser],
	);

	const value = React.useMemo<AuthContextValue>(
		() => ({
			user,
			token,
			isAuthenticated: Boolean(token),
			isLoading,
			signIn,
			signOut,
			hydrateUser,
			initialize,
		}),
		[user, token, isLoading, signIn, signOut, hydrateUser, initialize],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
}
