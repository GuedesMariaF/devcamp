import type { FieldErrors } from "react-hook-form";

function collectMessages(errors: FieldErrors, messages: string[]): void {
	for (const value of Object.values(errors)) {
		if (!value) continue;
		if (typeof value === "object" && "message" in value && value.message) {
			messages.push(String(value.message));
			continue;
		}
		if (typeof value === "object") {
			collectMessages(value as FieldErrors, messages);
		}
	}
}

export function getFirstFormErrorMessage(
	errors: FieldErrors,
): string | undefined {
	const messages: string[] = [];
	collectMessages(errors, messages);
	return messages[0];
}

export interface FormErrorEntry {
	/** Segmentos do caminho até o erro (ex.: ["guides", 0, "fields", 2, "type"]) — números indicam índice de array. */
	path: (string | number)[];
	message: string;
}

function collectErrorEntries(
	errors: FieldErrors,
	path: (string | number)[],
	entries: FormErrorEntry[],
): void {
	for (const [key, value] of Object.entries(errors)) {
		if (!value) continue;
		const segment = /^\d+$/.test(key) ? Number(key) : key;
		const nextPath = [...path, segment];
		if (typeof value === "object" && "message" in value && value.message) {
			entries.push({ path: nextPath, message: String(value.message) });
			continue;
		}
		if (typeof value === "object") {
			collectErrorEntries(value as FieldErrors, nextPath, entries);
		}
	}
}

/** Como `getFirstFormErrorMessage`, mas devolve também o caminho até o erro — pra localizar em qual guide/campo ele está, não só o texto. */
export function getFirstFormError(
	errors: FieldErrors,
): FormErrorEntry | undefined {
	const entries: FormErrorEntry[] = [];
	collectErrorEntries(errors, [], entries);
	return entries[0];
}
