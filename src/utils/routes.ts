/** Centraliza os paths da aplicação — evite strings soltas nos componentes. */
export const routes = {
	signIn: "/",
	dashboard: "/dashboard",
	examples: {
		index: "/exemplos",
	},
} as const;
