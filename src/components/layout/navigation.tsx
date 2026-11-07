import { Link } from "@tanstack/react-router";
import { navigation } from "@/config/navigation";
import { usePermissions } from "@/hooks/use-permissions";

interface NavigationProps {
	onNavigate?: () => void;
}

/** Navegação vertical da sidebar: barra de 3px em brasa marca o item ativo. */
export function Navigation({ onNavigate }: NavigationProps) {
	const { hasPermission } = usePermissions();

	const items = navigation.filter(
		(item) => !item.permission || hasPermission(item.permission),
	);

	return (
		<ul className="flex flex-col gap-0.5">
			{items.map((item) => (
				<li key={item.href}>
					<Link
						to={item.href}
						onClick={onNavigate}
						className="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-body-m text-sidebar-foreground transition-colors outline-none hover:bg-sidebar-muted hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[status=active]:bg-sidebar-accent data-[status=active]:font-semibold data-[status=active]:text-sidebar-accent-foreground"
					>
						<span
							aria-hidden
							className="h-3.5 w-[3px] shrink-0 rounded-[2px] bg-sidebar-accent group-data-[status=active]:bg-sidebar-primary"
						/>
						{item.title}
					</Link>
				</li>
			))}
		</ul>
	);
}
