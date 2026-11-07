import {
	createRootRoute,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import * as React from "react";
import type { LoadingBarRef } from "react-top-loading-bar";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopLoadingBar } from "@/components/ui/top-loading-bar";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { useThemeStore } from "@/stores/theme-store";
import type { RouterContext } from "@/types/router-context";

export const Route = createRootRoute({
	context: (): RouterContext => ({}),
	component: RootComponent,
});

function RootComponent() {
	const loadingBarRef = React.useRef<LoadingBarRef>(null);
	const status = useRouterState({ select: (s) => s.status });

	React.useEffect(() => {
		useThemeStore.getState().hydrate();
	}, []);

	React.useEffect(() => {
		if (status === "pending") {
			loadingBarRef.current?.continuousStart(20, 1000);
			return;
		}
		loadingBarRef.current?.complete();
	}, [status]);

	return (
		<QueryProvider>
			<AuthProvider>
				<NuqsAdapter>
					<TopLoadingBar ref={loadingBarRef} />
					<TooltipProvider>
						<Outlet />
					</TooltipProvider>
				</NuqsAdapter>
				<Toaster position="top-center" />
			</AuthProvider>
		</QueryProvider>
	);
}
