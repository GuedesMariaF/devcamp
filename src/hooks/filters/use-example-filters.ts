import { parseAsString } from "nuqs";
import { createFilterParams } from "./create-filter-params";

export const useExampleFilters = createFilterParams({
	base: true,
	custom: {
		status: parseAsString.withDefault(""),
	},
});
