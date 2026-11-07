import { createFileRoute } from "@tanstack/react-router";
import { ListFilterIcon, SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type ExampleResource, useIndexExamples } from "@/api/stubs/examples";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableEmpty } from "@/components/data-table/data-table-empty";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { exampleColumns } from "@/components/examples/example-columns";
import { Button } from "@/components/ui/button";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useExampleFilters } from "@/hooks/filters/use-example-filters";

export const Route = createFileRoute("/(protected)/exemplos/")({
	component: ExamplesPage,
});

const ALL = "all";
const STATUS_LABEL: Record<ExampleResource["status"], string> = {
	active: "Ativo",
	inactive: "Inativo",
};

function isStatus(value: string): value is ExampleResource["status"] {
	return value in STATUS_LABEL;
}

function ExamplesPage() {
	const { page, perPage, search, status, setFilterParams } =
		useExampleFilters();

	// Estado local dos inputs; só vai para a URL ao clicar em "Filtrar".
	const [searchInput, setSearchInput] = useState(search);
	const [statusInput, setStatusInput] = useState(status || ALL);

	useEffect(() => setSearchInput(search), [search]);
	useEffect(() => setStatusInput(status || ALL), [status]);

	const { data, isLoading } = useIndexExamples({
		page,
		per_page: perPage,
		search: search || undefined,
		status: isStatus(status) ? status : undefined,
	});

	const items = data?.data?.data ?? [];
	const pagination = data?.data?.pagination;
	const hasActiveFilters = Boolean(search) || Boolean(status);

	const applyFilters = () =>
		setFilterParams({
			search: searchInput || null,
			status: statusInput === ALL ? null : statusInput,
			page: 1,
		});

	const clearFilters = () => {
		setSearchInput("");
		setStatusInput(ALL);
		setFilterParams({ search: null, status: null, page: 1 });
	};

	return (
		<>
			<Heading>
				<HeadingTitle className="font-medium">Exemplos</HeadingTitle>
				<HeadingDescription>
					Padrão de listagem: filtros na URL (nuqs) + DataTable + paginação
				</HeadingDescription>
			</Heading>

			<div className="space-y-4">
				<search
					className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
					aria-label="Filtros da listagem"
				>
					<div className="relative min-w-[200px] max-w-sm flex-1">
						<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Buscar por nome ou e-mail…"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") applyFilters();
							}}
							className="pl-9"
						/>
					</div>
					<div className="min-w-[10rem]">
						<Select
							items={{ [ALL]: "Todos os status", ...STATUS_LABEL }}
							value={statusInput}
							onValueChange={(value) => setStatusInput(value ?? ALL)}
						>
							<SelectTrigger className="w-full" aria-label="Status">
								<SelectValue placeholder="Todos os status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={ALL}>Todos os status</SelectItem>
								{Object.entries(STATUS_LABEL).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							onClick={applyFilters}
							className="[&_svg]:size-3.5"
						>
							<ListFilterIcon />
							Filtrar
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={clearFilters}
							disabled={!hasActiveFilters}
							className="[&_svg]:size-3.5"
						>
							<XIcon />
							Limpar
						</Button>
					</div>
				</search>

				<DataTable
					columns={exampleColumns}
					data={items}
					isLoading={isLoading}
					pageSize={perPage}
					emptyContent={
						<DataTableEmpty
							title="Nenhum registro encontrado."
							description={
								hasActiveFilters
									? "Tente ajustar a busca ou limpar os filtros."
									: undefined
							}
							hasActiveFilters={hasActiveFilters}
							onClearFilters={clearFilters}
						/>
					}
				/>
				<DataTablePagination
					pagination={pagination}
					onPageChange={(p) => setFilterParams({ page: p })}
					onPerPageChange={(pp) => setFilterParams({ perPage: pp, page: 1 })}
				/>
			</div>
		</>
	);
}
