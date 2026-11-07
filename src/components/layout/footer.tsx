import { APP_NAME } from "@/config/app";

export function Footer() {
	return (
		<footer className="border-t">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs text-muted-foreground">
				<p>
					©{new Date().getFullYear()} {APP_NAME}
				</p>
			</div>
		</footer>
	);
}
