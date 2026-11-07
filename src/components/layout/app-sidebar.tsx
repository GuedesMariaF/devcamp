import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import * as React from "react";
import { Logo } from "@/components/brand/logo";
import { DropdownMenuProfile } from "@/components/layout/dropdown-menu-profile";
import { Navigation } from "@/components/layout/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/config/app";
import { cn } from "@/lib/utils";
import { routes } from "@/utils/routes";

function SidebarLogo({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<Link
			to={routes.dashboard}
			onClick={onNavigate}
			aria-label={APP_NAME}
			className="rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
		>
			<Logo
				symbolClassName="size-12"
				wordmarkClassName="text-[26px] text-paper-50"
			/>
		</Link>
	);
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<>
			<SidebarLogo onNavigate={onNavigate} />
			<nav aria-label="Principal" className="flex-1">
				<Navigation onNavigate={onNavigate} />
			</nav>
			<div className="dark flex items-center justify-between gap-3 border-t border-sidebar-border pt-4">
				<DropdownMenuProfile />
				<ThemeToggle />
			</div>
		</>
	);
}

const sidebarClasses =
	"flex flex-col gap-7 bg-sidebar px-5 py-6 text-sidebar-foreground";

/** Sidebar em grafite — o "terminal" da aplicação. */
export function AppSidebar({ className }: { className?: string }) {
	return (
		<aside
			className={cn(
				sidebarClasses,
				"sticky top-0 hidden h-dvh w-62 shrink-0 md:flex",
				className,
			)}
		>
			<SidebarBody />
		</aside>
	);
}

/** Barra superior com menu em sheet para telas pequenas. */
export function MobileTopBar() {
	const [open, setOpen] = React.useState(false);

	return (
		<header className="sticky top-0 z-40 flex items-center justify-between bg-sidebar px-4 py-3 md:hidden">
			<SidebarLogo />
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger
					render={
						<Button
							variant="ghost"
							size="icon"
							aria-label="Abrir menu"
							className="text-paper-50 hover:bg-sidebar-accent hover:text-paper-50"
						/>
					}
				>
					<MenuIcon />
				</SheetTrigger>
				<SheetContent
					side="left"
					className={cn(sidebarClasses, "w-72 border-sidebar-border")}
				>
					<SheetTitle className="sr-only">Menu</SheetTitle>
					<SidebarBody onNavigate={() => setOpen(false)} />
				</SheetContent>
			</Sheet>
		</header>
	);
}
