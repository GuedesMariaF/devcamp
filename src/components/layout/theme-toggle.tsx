import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeToggle() {
	const setTheme = useThemeStore((s) => s.setTheme);

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				render={
					<Button variant="ghost" size="icon" aria-label="Alterar tema" />
				}
			>
				<SunIcon className="size-4 dark:hidden" />
				<MoonIcon className="hidden size-4 dark:block" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<SunIcon />
					Claro
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<MoonIcon />
					Escuro
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<MonitorIcon />
					Sistema
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
