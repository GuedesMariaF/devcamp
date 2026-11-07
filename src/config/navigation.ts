import {
	LayoutDashboardIcon,
	type LucideIcon,
	SparklesIcon,
} from "lucide-react";
import { routes } from "@/utils/routes";

export interface NavItem {
	title: string;
	href: string;
	icon: LucideIcon;
	/** Quando definido, o item só aparece para quem tem a permissão. */
	permission?: string;
}

export const navigation: NavItem[] = [
	{ title: "Dashboard", href: routes.dashboard, icon: LayoutDashboardIcon },
	{ title: "Exemplos", href: routes.examples.index, icon: SparklesIcon },
];
