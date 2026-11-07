import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Ensina o tailwind-merge que as utilities de tipografia da marca
 * (definidas em styles.css) são tamanhos de fonte, não cores — senão
 * `text-label-s` apagaria um `text-muted-foreground` na mesma lista.
 */
const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"display-xl",
						"display-l",
						"heading-h1",
						"heading-h2",
						"body-l",
						"body-m",
						"label-s",
						"code-m",
						"code-label",
					],
				},
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
