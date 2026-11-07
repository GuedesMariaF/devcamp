import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type Header,
	type OnChangeFn,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { type CSSProperties, type ReactNode, useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE = 10;
const MAX_SKELETON_ROWS = 100;

const SORT_POPOVER_LABELS_BY_COLUMN_ID: Record<
	string,
	{ asc: string; desc: string }
> = {
	name: { asc: "Nome (A–Z)", desc: "Nome (Z–A)" },
	email: { asc: "E-mail (A–Z)", desc: "E-mail (Z–A)" },
	status: { asc: "Status (crescente)", desc: "Status (decrescente)" },
	updated_at: {
		asc: "Atualizado em (mais antigo)",
		desc: "Atualizado em (mais recente)",
	},
	created_at: {
		asc: "Criado em (mais antigo)",
		desc: "Criado em (mais recente)",
	},
	tag: { asc: "Tag (A–Z)", desc: "Tag (Z–A)" },
	role: { asc: "Cargo (A–Z)", desc: "Cargo (Z–A)" },
	email_verified_at: {
		asc: "E-mail verificado (mais antigo)",
		desc: "E-mail verificado (mais recente)",
	},
	project_code: { asc: "Código (A–Z)", desc: "Código (Z–A)" },
	company: { asc: "Empresa (A–Z)", desc: "Empresa (Z–A)" },
	branch: { asc: "Filial (A–Z)", desc: "Filial (Z–A)" },
};

const DEFAULT_SORT_POPOVER_LABELS = {
	asc: "Crescente",
	desc: "Decrescente",
} as const;

function getSortPopoverLabels(columnId: string): {
	asc: string;
	desc: string;
} {
	return (
		SORT_POPOVER_LABELS_BY_COLUMN_ID[columnId] ?? DEFAULT_SORT_POPOVER_LABELS
	);
}

function resolveSkeletonRowCount(pageSize?: number): number {
	const n = pageSize ?? DEFAULT_PAGE_SIZE;
	return Math.min(Math.max(n, 1), MAX_SKELETON_ROWS);
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	emptyMessage?: string;
	emptyContent?: ReactNode;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
	manualSorting?: boolean;
	headerSortVariant?: "toggle" | "popover";
	onRowClick?: (row: TData) => void;
	isLoading?: boolean;
	pageSize?: number;
}

const ACTION_COL_WIDTH_REM = 3.25;

function columnSizingStyle<TData, TValue>(
	columnDef: ColumnDef<TData, TValue>,
	getPixelSize: () => number,
): CSSProperties {
	const meta = columnDef.meta;
	if (meta?.grow) {
		return { minWidth: 0 };
	}
	if (meta?.actionFit) {
		return {
			whiteSpace: "nowrap",
			width: "1%",
			minWidth: "max-content",
		};
	}
	if (meta?.actionIcon) {
		return {
			whiteSpace: "nowrap",
			width: `${ACTION_COL_WIDTH_REM}rem`,
			minWidth: `${ACTION_COL_WIDTH_REM}rem`,
			maxWidth: `${ACTION_COL_WIDTH_REM}rem`,
		};
	}
	if (meta?.fit) {
		return { whiteSpace: "nowrap", minWidth: "max-content" };
	}
	return {
		width: getPixelSize(),
		minWidth: columnDef.minSize,
		maxWidth: columnDef.maxSize,
	};
}

/** Conta colunas `grow` vs `fit` (tudo o que não é `grow` nem coluna de ação conta como fit). */
function countSkeletonBuckets<TData>(
	headers: { column: { columnDef: ColumnDef<TData, unknown> } }[],
) {
	let grow = 0;
	let fit = 0;
	let action = 0;
	for (const h of headers) {
		const m = h.column.columnDef.meta;
		if (m?.actionIcon) {
			action += 1;
			continue;
		}
		if (m?.actionFit) {
			fit += 1;
			continue;
		}
		if (m?.grow) grow += 1;
		else fit += 1;
	}
	return { grow, fit, action };
}

/** Larguras em `table-fixed` durante loading: grow absorve ~58% do espaço livre, fit ~42%, ações fixas à direita. */
function skeletonColumnStyle<TData, TValue>(
	columnDef: ColumnDef<TData, TValue>,
	buckets: { grow: number; fit: number; action: number },
): CSSProperties {
	const meta = columnDef.meta;
	const w = `${ACTION_COL_WIDTH_REM}rem`;
	if (meta?.actionFit) {
		return {
			whiteSpace: "nowrap",
			width: "1%",
			minWidth: "max-content",
		};
	}
	if (meta?.actionIcon) {
		return {
			whiteSpace: "nowrap",
			width: w,
			minWidth: w,
			maxWidth: w,
		};
	}

	const free =
		buckets.action > 0
			? `calc(100% - ${buckets.action * ACTION_COL_WIDTH_REM}rem)`
			: "100%";
	const { grow, fit } = buckets;

	if (grow > 0 && fit > 0) {
		if (meta?.grow) {
			return { width: `calc(${free} * 0.58 / ${grow})`, minWidth: 0 };
		}
		return { width: `calc(${free} * 0.42 / ${fit})`, minWidth: 0 };
	}
	if (grow > 0) {
		return { width: `calc(${free} / ${grow})`, minWidth: 0 };
	}
	if (fit > 0) {
		return { width: `calc(${free} / ${fit})`, minWidth: 0 };
	}
	return { minWidth: 0 };
}

export function DataTable<TData, TValue>({
	columns,
	data,
	emptyMessage = "Nenhum registro encontrado.",
	emptyContent,
	sorting: sortingProp,
	onSortingChange: onSortingChangeProp,
	manualSorting = false,
	headerSortVariant = "popover",
	onRowClick,
	isLoading = false,
	pageSize: pageSizeProp,
}: DataTableProps<TData, TValue>) {
	const [internalSorting, setInternalSorting] = useState<SortingState>([]);
	const sorting = sortingProp ?? internalSorting;
	const onSortingChange = onSortingChangeProp ?? setInternalSorting;
	const controlled =
		sortingProp !== undefined && onSortingChangeProp !== undefined;

	const skeletonRows = resolveSkeletonRowCount(pageSizeProp);

	const table = useReactTable({
		data: isLoading ? [] : data,
		columns,
		state: { sorting },
		onSortingChange,
		manualSorting: manualSorting || controlled,
		getCoreRowModel: getCoreRowModel(),
		...(manualSorting || controlled
			? {}
			: { getSortedRowModel: getSortedRowModel() }),
	});

	const headerGroup = table.getHeaderGroups()[0];
	const skeletonBuckets = headerGroup
		? countSkeletonBuckets(headerGroup.headers)
		: { grow: 0, fit: 0, action: 0 };

	return (
		<div className="rounded-md border" aria-busy={isLoading || undefined}>
			<Table className={cn("w-full", isLoading ? "table-fixed" : "table-auto")}>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="text-xs">
							{headerGroup.headers.map((header) => {
								const def = header.column.columnDef;
								const meta = def.meta;
								return (
									<TableHead
										key={header.id}
										className={cn(
											meta?.grow && "min-w-0",
											(meta?.actionIcon || meta?.actionFit) &&
												"w-px min-w-0 px-2 text-right",
										)}
										style={
											isLoading
												? skeletonColumnStyle(def, skeletonBuckets)
												: columnSizingStyle(def, () => header.getSize())
										}
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											headerSortVariant === "popover" ? (
												<DataTableSortHeaderPopover
													header={header}
													isLoading={isLoading}
												/>
											) : (
												<button
													type="button"
													disabled={isLoading}
													className="flex items-center gap-1 hover:text-foreground -ml-2 px-2 py-1 rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50"
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													<SortIcon direction={header.column.getIsSorted()} />
												</button>
											)
										) : (
											flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{isLoading && headerGroup ? (
						Array.from({ length: skeletonRows }).map((_, rowIdx) => (
							<TableRow key={`skeleton-${rowIdx}`} aria-hidden>
								{headerGroup.headers.map((header) => {
									const def = header.column.columnDef;
									const meta = def.meta;
									const isAction = Boolean(meta?.actionIcon || meta?.actionFit);
									return (
										<TableCell
											key={`${header.id}-${rowIdx}`}
											className={cn(
												!isAction && "min-w-0",
												isAction && "w-px min-w-0 px-2 text-right",
											)}
											style={skeletonColumnStyle(def, skeletonBuckets)}
										>
											{isAction ? (
												<Skeleton className="size-9 shrink-0 rounded-md [aspect-ratio:1/1]" />
											) : (
												<Skeleton className="block min-h-10 w-full min-w-0 rounded-md" />
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className={cn(
									onRowClick &&
										"cursor-pointer hover:bg-muted/50 data-[state=selected]:hover:bg-muted/50",
								)}
								onClick={
									onRowClick
										? () => {
												onRowClick(row.original);
											}
										: undefined
								}
							>
								{row.getVisibleCells().map((cell) => {
									const def = cell.column.columnDef;
									const meta = def.meta;
									return (
										<TableCell
											key={cell.id}
											className={cn(
												meta?.grow && "min-w-0",
												(meta?.actionIcon || meta?.actionFit) &&
													"w-px min-w-0 px-2 text-right",
											)}
											style={columnSizingStyle(def, () =>
												cell.column.getSize(),
											)}
											onClick={
												onRowClick && meta?.stopRowClick
													? (e) => e.stopPropagation()
													: undefined
											}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-32 p-0 align-middle"
							>
								{emptyContent ?? (
									<div className="flex h-full min-h-24 items-center justify-center text-center text-muted-foreground">
										{emptyMessage}
									</div>
								)}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
	if (direction === "asc") return <ArrowUpIcon className={cn("size-3.5")} />;
	if (direction === "desc") return <ArrowDownIcon className={cn("size-3.5")} />;
	return (
		<ArrowUpDownIcon className={cn("size-3.5 text-muted-foreground/50")} />
	);
}

function DataTableSortHeaderPopover<TData, TValue>({
	header,
	isLoading,
}: {
	header: Header<TData, TValue>;
	isLoading: boolean;
}) {
	const [open, setOpen] = useState(false);
	const table = header.getContext().table;
	const column = header.column;
	const labels = getSortPopoverLabels(column.id);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				nativeButton={false}
				render={
					<button
						type="button"
						disabled={isLoading}
						aria-expanded={open}
						aria-haspopup="dialog"
						className="flex items-center gap-1 hover:text-foreground -ml-2 px-2 py-1 rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50"
					/>
				}
			>
				{flexRender(column.columnDef.header, header.getContext())}
				<SortIcon direction={column.getIsSorted()} />
			</PopoverTrigger>
			<PopoverContent align="end" className="w-fit p-0 py-1">
				<div className="flex flex-col gap-0.5 px-1">
					<button
						type="button"
						className={cn(
							"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground",
							column.getIsSorted() === "asc" &&
								"bg-accent text-accent-foreground",
						)}
						onClick={() => {
							table.setSorting([{ id: column.id, desc: false }]);
							setOpen(false);
						}}
					>
						<ArrowUpIcon
							className="size-3.5 shrink-0 text-muted-foreground"
							aria-hidden
						/>
						<span className="min-w-0 flex-1">{labels.asc}</span>
					</button>
					<button
						type="button"
						className={cn(
							"flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground",
							column.getIsSorted() === "desc" &&
								"bg-accent text-accent-foreground",
						)}
						onClick={() => {
							table.setSorting([{ id: column.id, desc: true }]);
							setOpen(false);
						}}
					>
						<ArrowDownIcon
							className="size-3.5 shrink-0 text-muted-foreground"
							aria-hidden
						/>
						<span className="min-w-0 flex-1">{labels.desc}</span>
					</button>
				</div>
				<Separator className="my-1" />

				<div className="px-1">
					<button
						type="button"
						className="flex w-full items-center rounded-md px-2 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
						onClick={() => {
							table.setSorting([]);
							setOpen(false);
						}}
					>
						Sem ordenação
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
