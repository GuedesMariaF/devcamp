import { Link } from "@tanstack/react-router";
import { navigation } from "@/config/navigation";
import { usePermissions } from "@/hooks/use-permissions";

export function Navigation() {
	const { hasPermission } = usePermissions();

	const items = navigation.filter(
		(item) => !item.permission || hasPermission(item.permission),
	);

	return (
		<ul className="flex items-center gap-1">
			{items.map((item) => (
				<li key={item.href}>
					<Link
						to={item.href}
						className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						activeProps={{ className: "bg-accent text-foreground" }}
					>
						<item.icon className="size-4" aria-hidden />
						{item.title}
					</Link>
				</li>
			))}
		</ul>
	);
}
