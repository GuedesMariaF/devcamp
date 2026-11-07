import * as React from "react";
import { Logo } from "@/components/brand/logo";
import { Typewriter } from "@/components/brand/typewriter";
import { cn } from "@/lib/utils";

const TITLE = "O acampamento base do seu time de dev.";
const COMMAND = 'devcamp new projeto --time="backend"';

/**
 * Capa do login em grafite, como no brand board. O título e o comando
 * são "digitados" em sequência, com o cursor `_` do símbolo da marca.
 */
export function AuthCover() {
	const [step, setStep] = React.useState<"title" | "description" | "command">(
		"title",
	);

	// Depois do fade da descrição, começa a digitar o comando.
	React.useEffect(() => {
		if (step !== "description") return;
		const timeout = setTimeout(() => setStep("command"), 700);
		return () => clearTimeout(timeout);
	}, [step]);

	return (
		<div className="relative col-span-6 m-3 hidden flex-col gap-12 overflow-hidden rounded-2xl bg-graphite-900 p-10 md:flex lg:p-14 dark:border dark:border-graphite-700 dark:bg-graphite-800">
			{/* Quadriculado que some nas bordas, com um brilho de brasa no canto */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-grid [--grid-color:var(--color-graphite-700)] [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)] opacity-70"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-ember-500/15 blur-3xl"
			/>

			<Logo
				className="relative"
				symbolClassName="size-10 lg:size-12"
				wordmarkClassName="text-[36px] lg:text-[44px] text-paper-50"
			/>

			<div className="relative mt-auto flex flex-col gap-6">
				<h1 className="max-w-[14ch] font-display text-[clamp(2.25rem,3.6vw,4.5rem)] leading-[1.05] font-bold tracking-[-1.5px] text-balance text-paper-50">
					<Typewriter
						text={TITLE}
						speed={45}
						startDelay={300}
						onDone={() => setStep("description")}
					/>
				</h1>

				<p
					className={cn(
						"max-w-xl text-body-l text-graphite-300 transition-all duration-700 motion-reduce:transition-none",
						step === "title" ? "translate-y-1 opacity-0" : "opacity-100",
					)}
				>
					Projetos, tarefas, discussões e deploys num só acampamento — sem o
					caos de 12 ferramentas abertas.
				</p>

				<div
					className={cn(
						"flex w-fit max-w-full gap-2.5 overflow-hidden rounded-[10px] border border-graphite-700 bg-graphite-800 px-5 py-3.5 text-code-m whitespace-nowrap transition-opacity duration-500 motion-reduce:transition-none dark:bg-graphite-900",
						step === "title" ? "opacity-0" : "opacity-100",
					)}
				>
					<span className="text-ember-500">$</span>
					<Typewriter
						text={COMMAND}
						speed={55}
						enabled={step === "command"}
						keepCursor
						className="text-paper-100"
					/>
				</div>
			</div>
		</div>
	);
}
