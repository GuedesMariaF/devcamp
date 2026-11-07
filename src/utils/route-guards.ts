import { redirect } from "@tanstack/react-router";
import { getStoredToken } from "@/lib/auth";
import { bootstrapAuthFromStorage } from "@/lib/auth-session";
import { getAuthState } from "@/lib/auth-state";
import { usePermissionStore } from "@/stores/permission-store";
import { routes } from "@/utils/routes";

export type RoutePermissionsStaticData = {
	requiredPermission?: string;
	requiredPermissions?: string[];
	requireAll?: boolean;
};

async function isAuthenticated(): Promise<boolean> {
	const auth = getAuthState();
	return auth ? auth.initialize() : (await bootstrapAuthFromStorage()) !== null;
}

export async function ensureAuthenticated(): Promise<void> {
	if (!(await isAuthenticated())) {
		throw redirect({ to: routes.signIn });
	}
}

export async function redirectIfAuthenticated(
	to: string = routes.dashboard,
): Promise<void> {
	if (!getStoredToken()) return;
	if (await isAuthenticated()) {
		throw redirect({ to });
	}
}

/** Use no `beforeLoad` de rotas que exigem permissão específica. */
export function ensureRoutePermissions(
	staticData: RoutePermissionsStaticData | undefined,
): void {
	if (!staticData) return;

	const {
		requiredPermission,
		requiredPermissions,
		requireAll = false,
	} = staticData;
	const store = usePermissionStore.getState();

	if (requiredPermission && store.hasPermission(requiredPermission)) return;

	if (requiredPermissions?.length) {
		const ok = requireAll
			? store.hasAllPermissions(requiredPermissions)
			: store.hasAnyPermission(requiredPermissions);
		if (ok) return;
	}

	if (requiredPermission || requiredPermissions?.length) {
		throw redirect({ to: routes.dashboard });
	}
}
