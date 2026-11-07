import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

export type TaskStatus =
	| "todo"
	| "in-progress"
	| "in-review"
	| "done"
	| "blocked";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
	todo: "A fazer",
	"in-progress": "Em andamento",
	"in-review": "Em revisão",
	done: "Feito",
	blocked: "Bloqueado",
};

const statusTagVariants = cva(
	"inline-flex shrink-0 items-center gap-1.5 rounded-full py-[5px] pr-3 pl-2.5 text-label-s whitespace-nowrap text-graphite-900",
	{
		variants: {
			status: {
				todo: "bg-status-todo",
				"in-progress": "bg-status-in-progress",
				"in-review": "bg-status-in-review",
				done: "bg-status-done",
				blocked: "bg-status-blocked",
			},
		},
		defaultVariants: { status: "todo" },
	},
);

interface StatusTagProps
	extends Omit<React.ComponentProps<"span">, "children">,
		VariantProps<typeof statusTagVariants> {}

/** Tag de status de tarefa, no vocabulário do fluxo de dev. */
function StatusTag({ className, status = "todo", ...props }: StatusTagProps) {
	const key = status ?? "todo";
	return (
		<span
			data-slot="status-tag"
			data-status={key}
			className={cn(statusTagVariants({ status: key }), className)}
			{...props}
		>
			{TASK_STATUS_LABEL[key]}
		</span>
	);
}

export { StatusTag, statusTagVariants };
