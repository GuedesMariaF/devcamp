import type { ColumnDef } from "@tanstack/react-table";
import type { ExampleResource } from "@/api/stubs/examples";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";

export const exampleColumns: ColumnDef<ExampleResource>[] = [
	{
		accessorKey: "name",
		header: "Nome",
		meta: { grow: true },
	},
	{
		accessorKey: "email",
		header: "E-mail",
	},
	{
		accessorKey: "status",
		header: "Status",
		meta: { fit: true },
		cell: ({ row }) =>
			row.original.status === "active" ? (
				<Badge>Ativo</Badge>
			) : (
				<Badge variant="secondary">Inativo</Badge>
			),
	},
	{
		accessorKey: "created_at",
		header: "Criado em",
		meta: { fit: true },
		cell: ({ row }) => formatDate(row.original.created_at),
	},
];
