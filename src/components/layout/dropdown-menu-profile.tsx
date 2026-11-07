import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { getInitialsCharacters } from "@/utils/get-initial-characters";
import { routes } from "@/utils/routes";

export function DropdownMenuProfile() {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut();
		navigate({ to: routes.signIn });
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				nativeButton={false}
				render={
					<button
						type="button"
						className="inline-flex rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						aria-label="Abrir menu de perfil"
					/>
				}
			>
				<Avatar className="size-8">
					<AvatarFallback className="text-xs">
						{getInitialsCharacters(user?.name ?? "")}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="end" className="min-w-48">
				<div className="-space-y-0.5 px-2 py-1.5">
					<p className="text-sm font-semibold">{user?.name}</p>
					<p className="text-xs text-muted-foreground">{user?.email}</p>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					<LogOutIcon />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
