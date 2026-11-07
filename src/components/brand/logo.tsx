import logoSimbolo from "@/assets/brand/logo-simbolo.svg";
import { cn } from "@/lib/utils";

/** Símbolo devcamp: a barraca (^) do acampamento base + o cursor (_) aceso na entrada. */
export function LogoSymbol({ className }: { className?: string }) {
	return (
		<img
			src={logoSimbolo}
			alt=""
			aria-hidden
			width={64}
			height={64}
			className={cn("size-12 shrink-0", className)}
		/>
	);
}

interface LogoProps {
	className?: string;
	/** Classes do símbolo (tamanho). */
	symbolClassName?: string;
	/** Classes do wordmark (tamanho/cor). Em fundo escuro use `text-paper-50`. */
	wordmarkClassName?: string;
}

/** Logo horizontal: símbolo + wordmark "devcamp." com o ponto em brasa. */
export function Logo({
	className,
	symbolClassName,
	wordmarkClassName,
}: LogoProps) {
	return (
		<span className={cn("inline-flex items-center gap-3.5", className)}>
			<LogoSymbol className={symbolClassName} />
			<span
				className={cn(
					"font-display text-[44px] leading-none font-bold tracking-[-1.5px] whitespace-nowrap",
					wordmarkClassName,
				)}
			>
				devcamp<span className="text-ember-500">.</span>
			</span>
		</span>
	);
}
