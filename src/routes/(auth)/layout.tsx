import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { APP_NAME } from "@/config/app";
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
		<div className="relative grid h-screen w-screen md:grid-cols-12">
			<div className="relative col-span-6 m-3 hidden min-h-0 overflow-hidden rounded-2xl bg-primary md:flex md:items-end md:p-10">
				<p className="text-4xl font-semibold text-primary-foreground">
					{APP_NAME}
				</p>
			</div>

			<div className="col-span-6 flex flex-col justify-center px-8 md:px-20 lg:px-32">
				<div className="mx-auto w-full max-w-sm space-y-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
