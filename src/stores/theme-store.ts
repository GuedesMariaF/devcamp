import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "vite-ui-theme";
export const DEFAULT_THEME: Theme = "system";

function getSystemTheme(): "light" | "dark" {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyThemeToRoot(theme: Theme) {
	const root = window.document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(theme === "system" ? getSystemTheme() : theme);
}

function getStoredTheme(): Theme {
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	return stored === "light" || stored === "dark" || stored === "system"
		? stored
		: DEFAULT_THEME;
}

interface ThemeStore {
	theme: Theme;
	/** Tema efetivamente aplicado (resolve "system"). */
	resolvedTheme: "light" | "dark";
	setTheme: (theme: Theme) => void;
	hydrate: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
	theme: DEFAULT_THEME,
	resolvedTheme: "light",

	setTheme: (theme) => {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		applyThemeToRoot(theme);
		set({
			theme,
			resolvedTheme: theme === "system" ? getSystemTheme() : theme,
		});
	},

	hydrate: () => {
		const theme = getStoredTheme();
		applyThemeToRoot(theme);
		set({
			theme,
			resolvedTheme: theme === "system" ? getSystemTheme() : theme,
		});
	},
}));
