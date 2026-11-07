import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ensureAuthenticated } from "@/utils/route-guards";

export const Route = createFileRoute("/(protected)")({
	beforeLoad: async () => {
		await ensureAuthenticated();
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-dvh min-w-full flex-col">
			<Header />
			<main className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col gap-6 px-4 py-12">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
