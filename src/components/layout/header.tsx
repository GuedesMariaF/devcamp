import { Link } from "@tanstack/react-router";
import { DropdownMenuProfile } from "@/components/layout/dropdown-menu-profile";
import { Navigation } from "@/components/layout/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/config/app";
import { routes } from "@/utils/routes";

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-b bg-card">
			<div className="mx-auto flex size-full max-w-7xl items-center justify-between gap-6 px-4 py-4">
				<Link
					to={routes.dashboard}
					className="font-semibold tracking-tight transition-opacity hover:opacity-80"
				>
					{APP_NAME}
				</Link>

				<nav className="hidden flex-1 justify-center md:flex">
					<Navigation />
				</nav>

				<div className="flex items-center gap-3">
					<ThemeToggle />
					<Separator orientation="vertical" className="h-4" />
					<DropdownMenuProfile />
				</div>
			</div>
		</header>
	);
}
