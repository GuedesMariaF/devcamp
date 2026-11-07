import { z } from "zod";

export const signInFormSchema = z.object({
	email: z
		.string()
		.min(1, "E-mail é obrigatório")
		.email("Informe um e-mail válido"),
	password: z.string().min(1, "Senha é obrigatória"),
	remember: z.boolean(),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
