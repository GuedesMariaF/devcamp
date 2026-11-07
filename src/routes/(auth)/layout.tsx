import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { AuthCover } from "@/components/auth/auth-cover";
import { useAuth } from "@/hooks/use-auth";
import { redirectIfAuthenticated } from "@/utils/route-guards";
import { routes } from "@/utils/routes";

export const Route = createFileRoute("/(auth)")({
	beforeLoad: async () => {
		await redirectIfAuthenticated(routes.dashboard);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { isAuthenticated, user } = useAuth();

	if (isAuthenticated && user) {
		return <Navigate to={routes.dashboard} />;
	}

	return (
		<div className="relative grid min-h-dvh w-full md:grid-cols-12">
			<AuthCover />

			<div className="col-span-6 flex flex-col justify-center px-8 md:px-20 lg:px-32">
				<div className="mx-auto w-full max-w-sm space-y-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
