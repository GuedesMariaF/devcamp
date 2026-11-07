import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from "@/components/ui/heading";

export const Route = createFileRoute("/(auth)/")({
	component: SignInPage,
});

function SignInPage() {
	return (
		<div className="space-y-6">
			<Heading>
				<HeadingTitle size="sm">Faça login na sua conta</HeadingTitle>
				<HeadingDescription size="sm">
					Bem-vindo de volta! Informe suas credenciais para acessar.
				</HeadingDescription>
			</Heading>

			<SignInForm />
		</div>
	);
}
