import type { AxiosError } from "axios";

import { toast } from "sonner";

export function getApiMessage(error: unknown): string | undefined {
	if (error && typeof error === "object" && "response" in error) {
		const data = (error as AxiosError<{ message?: string }>).response?.data;
		return data?.message;
	}
	if (error instanceof Error) {
		return error.message;
	}
	return undefined;
}

export const onError = (error: AxiosError<{ message: string }> | Error) => {
	const message = getApiMessage(error);
	toast.error(
		message ?? "Ocorreu um erro inesperado. Tente novamente mais tarde.",
	);
};
