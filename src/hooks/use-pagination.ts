import * as React from "react";

type UsePaginationArgs = {
	currentPage: number;
	totalPages: number;
	paginationItemsToDisplay?: number;
};

export type UsePaginationResult = {
	pages: number[];
	showLeftEllipsis: boolean;
	showRightEllipsis: boolean;
};

/**
 * Calcula a janela de páginas visíveis e se deve exibir reticências à esquerda/direita.
 */
export function usePagination({
	currentPage,
	totalPages,
	paginationItemsToDisplay = 5,
}: UsePaginationArgs): UsePaginationResult {
	return React.useMemo(() => {
		if (totalPages < 1) {
			return {
				pages: [],
				showLeftEllipsis: false,
				showRightEllipsis: false,
			};
		}

		const maxVisible = Math.min(paginationItemsToDisplay, totalPages);
		const halfWindow = Math.floor((maxVisible - 1) / 2);

		let start = currentPage - halfWindow;
		let end = start + maxVisible - 1;

		if (start < 1) {
			start = 1;
			end = Math.min(totalPages, start + maxVisible - 1);
		}

		if (end > totalPages) {
			end = totalPages;
			start = Math.max(1, end - maxVisible + 1);
		}

		const pages: number[] = [];
		for (let p = start; p <= end; p++) {
			pages.push(p);
		}

		return {
			pages,
			showLeftEllipsis: start > 1,
			showRightEllipsis: end < totalPages,
		};
	}, [currentPage, totalPages, paginationItemsToDisplay]);
}
