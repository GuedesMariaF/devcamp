import "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface ColumnMeta<_TData, _TValue> {
		/** Coluna preenche a largura restante da tabela (ex.: primeira coluna). */
		grow?: boolean;
		/** Coluna com largura mínima conforme o conteúdo (estilo w-fit em tabela). */
		fit?: boolean;
		/** Coluna só com botão/ícone (ex.: menu de ações) — largura do trigger (w-9). */
		actionIcon?: boolean;
		/** Coluna de ações com largura conforme o conteúdo, alinhada à direita. */
		actionFit?: boolean;
		/** Não propagar clique à linha (ex.: select, menu) quando `DataTable` tem `onRowClick`. */
		stopRowClick?: boolean;
	}
}
