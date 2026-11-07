/**
 * Stub no MESMO formato que o Orval gera (`useIndexX(params)` + `getIndexXQueryKey`).
 * Serve de referência para a página de exemplo; em um módulo real, use o hook
 * de `@/api/generated/<tag>/<tag>` e apague este arquivo.
 */
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/auth";
import type { Pagination } from "@/types/pagination";

export interface ExampleResource {
	id: number;
	name: string;
	email: string;
	status: "active" | "inactive";
	created_at: string;
}

export interface IndexExamplesParams {
	page?: number;
	per_page?: number;
	search?: string;
	status?: ExampleResource["status"];
}

type IndexExamples200 = ApiResponse<{
	data: ExampleResource[];
	pagination: Pagination;
}>;

const DATA: ExampleResource[] = Array.from({ length: 47 }, (_, i) => ({
	id: i + 1,
	name: `Participante ${String(i + 1).padStart(2, "0")}`,
	email: `participante${i + 1}@devcamp.dev`,
	status: i % 3 === 0 ? "inactive" : "active",
	created_at: new Date(2026, 0, 1 + i).toISOString(),
}));

async function indexExamples(
	params: IndexExamplesParams,
): Promise<IndexExamples200> {
	await new Promise((r) => setTimeout(r, 300));
	const { page = 1, per_page = 10, search, status } = params;
	const filtered = DATA.filter(
		(item) =>
			(!search ||
				item.name.toLowerCase().includes(search.toLowerCase()) ||
				item.email.toLowerCase().includes(search.toLowerCase())) &&
			(!status || item.status === status),
	);
	const total = filtered.length;
	const slice = filtered.slice((page - 1) * per_page, page * per_page);
	return {
		error: false,
		message: "",
		data: {
			data: slice,
			pagination: {
				total,
				count: slice.length,
				per_page,
				current_page: page,
				total_pages: Math.max(1, Math.ceil(total / per_page)),
			},
		},
	};
}

export const getIndexExamplesQueryKey = (params?: IndexExamplesParams) =>
	["/api/examples", ...(params ? [params] : [])] as const;

export function useIndexExamples(params: IndexExamplesParams) {
	return useQuery({
		queryKey: getIndexExamplesQueryKey(params),
		queryFn: () => indexExamples(params),
	});
}
