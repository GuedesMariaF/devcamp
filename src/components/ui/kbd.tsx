import type * as React from "react";
import { cn } from "@/lib/utils";

/** Atalho de teclado — atalhos são cidadãos de primeira classe na marca. */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
	return (
		<kbd
			data-slot="kbd"
			className={cn(
				"inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-code-label",
				className,
			)}
			{...props}
		/>
	);
}

export { Kbd };
