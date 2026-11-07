export type RouterContext = object;

declare module "@tanstack/react-router" {
	interface Register {
		routerContext: RouterContext;
	}
}
