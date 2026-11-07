import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Heading,
	HeadingDescription,
	HeadingEyebrow,
	HeadingTitle,
} from "@/components/ui/heading";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = useAuth();

	return (
		<>
			<Heading>
				<HeadingEyebrow>Dashboard</HeadingEyebrow>
				<HeadingTitle>Olá{user?.name ? `, ${user.name}` : ""}</HeadingTitle>
				<HeadingDescription>Visão geral da aplicação</HeadingDescription>
			</Heading>

			<div className="grid gap-4 md:grid-cols-3">
				{["Projetos", "Tarefas", "Usuários"].map((title) => (
					<Card key={title}>
						<CardHeader>
							<CardDescription>{title}</CardDescription>
							<CardTitle className="text-2xl">—</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Conecte a um endpoint gerado pelo Orval.
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
