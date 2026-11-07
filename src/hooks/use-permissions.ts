import { usePermissionStore } from "@/stores/permission-store";

export function usePermissions() {
	const permissions = usePermissionStore((s) => s.permissions);
	const roles = usePermissionStore((s) => s.roles);
	const hasPermission = usePermissionStore((s) => s.hasPermission);
	const hasAnyPermission = usePermissionStore((s) => s.hasAnyPermission);
	const hasAllPermissions = usePermissionStore((s) => s.hasAllPermissions);
	const hasRole = usePermissionStore((s) => s.hasRole);

	return {
		permissions,
		roles,
		hasPermission,
		hasAnyPermission,
		hasAllPermissions,
		hasRole,
	};
}
