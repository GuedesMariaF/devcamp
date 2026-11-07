import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, MobileTopBar } from "@/components/layout/app-sidebar";
import { ensureAuthenticated } from "@/utils/route-guards";

export const Route = createFileRoute("/(protected)")({
	beforeLoad: async () => {
		await ensureAuthenticated();
	},
	component: RouteComponent,
});

/** Sidebar em grafite (o "terminal"), conteúdo em papel (o "caderno"). */
function RouteComponent() {
	return (
		<div className="flex min-h-dvh min-w-full flex-col md:flex-row">
			<AppSidebar />
			<MobileTopBar />
			<main className="flex w-full min-w-0 flex-1 flex-col gap-8 px-4 py-8 md:px-12 md:py-10">
				<Outlet />
			</main>
		</div>
	);
}
