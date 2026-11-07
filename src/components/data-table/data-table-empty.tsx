import { PlusIcon, SearchXIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export interface DataTableEmptyProps {
	title: string;
	description?: string;
	hasActiveFilters?: boolean;
	onClearFilters?: () => void;
	canCreate?: boolean;
	onCreate?: () => void;
	createLabel?: string;
}

export function DataTableEmpty({
	title,
	description,
	hasActiveFilters = false,
	onClearFilters,
	canCreate = false,
	onCreate,
	createLabel = "Adicionar novo",
}: DataTableEmptyProps) {
	const showClearFilters =
		hasActiveFilters && typeof onClearFilters === "function";
	const showCreate = canCreate && typeof onCreate === "function";
	const hasActions = showClearFilters || showCreate;

	return (
		<Empty className="w-full min-h-48 py-8">
			<EmptyHeader>
				<EmptyMedia variant="icon" className="size-8">
					<SearchXIcon className="size-4" aria-hidden />
				</EmptyMedia>
				<EmptyTitle className="text-sm">{title}</EmptyTitle>
				{description ? (
					<EmptyDescription className="text-xs">{description}</EmptyDescription>
				) : null}
			</EmptyHeader>
			{hasActions && (
				<EmptyContent>
					<div className="flex flex-wrap items-center justify-center gap-3">
						{showCreate && (
							<Button
								type="button"
								size="sm"
								onClick={onCreate}
								className="[&_svg]:size-3.5"
							>
								<PlusIcon />
								{createLabel}
							</Button>
						)}
						{showClearFilters && (
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={onClearFilters}
								className="[&_svg]:size-3.5"
							>
								<XIcon />
								Limpar filtros
							</Button>
						)}
					</div>
				</EmptyContent>
			)}
		</Empty>
	);
}
