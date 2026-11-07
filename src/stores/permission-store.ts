import { create } from "zustand";

interface PermissionState {
	permissions: string[];
	roles: string[];
	setPermissions: (permissions: string[], roles: string[]) => void;
	clearPermissions: () => void;
	hasPermission: (permission: string) => boolean;
	hasAnyPermission: (permissions: string[]) => boolean;
	hasAllPermissions: (permissions: string[]) => boolean;
	hasRole: (role: string) => boolean;
}

export const usePermissionStore = create<PermissionState>((set, get) => ({
	permissions: [],
	roles: [],
	setPermissions: (permissions, roles) => set({ permissions, roles }),
	clearPermissions: () => set({ permissions: [], roles: [] }),
	hasPermission: (permission) => get().permissions.includes(permission),
	hasAnyPermission: (permissions) =>
		permissions.some((p) => get().permissions.includes(p)),
	hasAllPermissions: (permissions) =>
		permissions.every((p) => get().permissions.includes(p)),
	hasRole: (role) => get().roles.includes(role),
}));
