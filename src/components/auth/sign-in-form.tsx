import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { type SignInFormData, signInFormSchema } from "@/schemas/auth";
import { onError } from "@/utils/on-error";
import { routes } from "@/utils/routes";

export function SignInForm() {
	const { signIn } = useAuth();
	const navigate = useNavigate();
	const emailId = useId();
	const passwordId = useId();

	const form = useForm<SignInFormData>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: { email: "", password: "", remember: true },
	});

	const onSubmit = async (data: SignInFormData) => {
		try {
			await signIn(data);
			navigate({ to: routes.dashboard });
		} catch (error) {
			onError(error as AxiosError<{ message: string }>);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<Controller
				control={form.control}
				name="email"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor={emailId}
							schema={signInFormSchema}
							fieldName="email"
						>
							E-mail
						</FieldLabel>
						<Input
							id={emailId}
							type="email"
							autoComplete="email"
							aria-invalid={fieldState.invalid}
							{...field}
						/>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>

			<Controller
				control={form.control}
				name="password"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel
							htmlFor={passwordId}
							schema={signInFormSchema}
							fieldName="password"
						>
							Senha
						</FieldLabel>
						<Input
							id={passwordId}
							type="password"
							autoComplete="current-password"
							aria-invalid={fieldState.invalid}
							{...field}
						/>
						<FieldError errors={[fieldState.error]} />
					</Field>
				)}
			/>

			<Button
				type="submit"
				className="w-full"
				disabled={form.formState.isSubmitting}
			>
				{form.formState.isSubmitting ? <Spinner /> : null}
				Entrar
			</Button>
		</form>
	);
}
