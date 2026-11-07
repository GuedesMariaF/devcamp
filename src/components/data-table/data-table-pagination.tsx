import {
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import {
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	Pagination as PaginationNav,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import type { Pagination as ApiPagination } from "@/types/pagination";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const paginationLinkDisabledClass =
	"aria-disabled:pointer-events-none aria-disabled:opacity-50";

interface DataTablePaginationProps {
	pagination: ApiPagination | undefined;
	onPageChange: (page: number) => void;
	/** Se omitido, o seletor de linhas por página não é exibido. */
	onPerPageChange?: (perPage: number) => void;
	pageSizeOptions?: readonly number[];
	/** Quantidade de botões numéricos de página (padrão 5). */
	paginationItemsToDisplay?: number;
}

export function DataTablePagination({
	pagination,
	onPageChange,
	onPerPageChange,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	paginationItemsToDisplay = 5,
}: DataTablePaginationProps) {
	const {
		current_page = 1,
		total_pages = 1,
		total = 0,
		per_page = 10,
	} = pagination ?? {};

	const safeTotalPages = Math.max(1, total_pages);

	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage: current_page,
		totalPages: safeTotalPages,
		paginationItemsToDisplay,
	});

	const sizeOptions = React.useMemo(() => {
		const merged = new Set<number>([...pageSizeOptions, per_page]);
		return [...merged].sort((a, b) => a - b);
	}, [pageSizeOptions, per_page]);

	const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;
	const to = total === 0 ? 0 : Math.min(current_page * per_page, total);

	const isFirst = current_page <= 1;
	const isLast = current_page >= safeTotalPages;

	const showPageSize = Boolean(onPerPageChange);

	const handleNavClick =
		(page: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
			e.preventDefault();
			onPageChange(page);
		};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
			<div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center justify-between sm:gap-6">
				<p className="text-xs text-muted-foreground tabular-nums">
					{total === 0
						? "Nenhum registro"
						: `Exibindo ${from} a ${to} de ${total} registro${total !== 1 ? "s" : ""}`}
				</p>

				<div className="inline-flex items-center gap-2 lg:gap-10">
					{showPageSize ? (
						<div className="flex items-center gap-2">
							<span className="whitespace-nowrap text-xs text-muted-foreground">
								Itens por página
							</span>
							<Select
								value={String(per_page)}
								onValueChange={(v) => {
									if (v == null) return;
									onPerPageChange?.(Number(v));
								}}
							>
								<SelectTrigger
									className="h-7 w-18 text-xs px-2"
									aria-label="Linhas por página"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{sizeOptions.map((n) => (
										<SelectItem key={n} value={String(n)}>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : null}

					<PaginationNav className="mx-0 w-full justify-center sm:w-auto sm:justify-end">
						<PaginationContent>
							<PaginationItem>
								<PaginationLink
									aria-disabled={isFirst ? true : undefined}
									aria-label="Ir para a primeira página"
									className={cn("size-7", paginationLinkDisabledClass)}
									href={isFirst ? undefined : "#"}
									size="icon"
									onClick={isFirst ? undefined : handleNavClick(1)}
								>
									<ChevronFirstIcon aria-hidden="true" size={16} />
								</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink
									aria-disabled={isFirst ? true : undefined}
									aria-label="Ir para a página anterior"
									className={cn("size-7", paginationLinkDisabledClass)}
									href={isFirst ? undefined : "#"}
									size="icon"
									onClick={
										isFirst ? undefined : handleNavClick(current_page - 1)
									}
								>
									<ChevronLeftIcon aria-hidden="true" size={16} />
								</PaginationLink>
							</PaginationItem>

							{showLeftEllipsis ? (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							) : null}

							{pages.map((page) => (
								<PaginationItem key={page}>
									<PaginationLink
										href="#"
										isActive={page === current_page}
										size="icon"
										className="size-7 min-w-7 text-xs"
										aria-label={`Página ${page}`}
										onClick={handleNavClick(page)}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							))}

							{showRightEllipsis ? (
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
							) : null}

							<PaginationItem>
								<PaginationLink
									aria-disabled={isLast ? true : undefined}
									aria-label="Ir para a próxima página"
									className={cn("size-7", paginationLinkDisabledClass)}
									href={isLast ? undefined : "#"}
									size="icon"
									onClick={
										isLast ? undefined : handleNavClick(current_page + 1)
									}
								>
									<ChevronRightIcon aria-hidden="true" size={16} />
								</PaginationLink>
							</PaginationItem>

							<PaginationItem>
								<PaginationLink
									aria-disabled={isLast ? true : undefined}
									aria-label="Ir para a última página"
									className={cn("size-7", paginationLinkDisabledClass)}
									href={isLast ? undefined : "#"}
									size="icon"
									onClick={isLast ? undefined : handleNavClick(safeTotalPages)}
								>
									<ChevronLastIcon aria-hidden="true" size={16} />
								</PaginationLink>
							</PaginationItem>
						</PaginationContent>
					</PaginationNav>
				</div>
			</div>
		</div>
	);
}
