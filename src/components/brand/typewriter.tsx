import * as React from "react";
import { cn } from "@/lib/utils";

function usePrefersReducedMotion() {
	const [reduced, setReduced] = React.useState(
		() => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	);

	React.useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onChange = () => setReduced(query.matches);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, []);

	return reduced;
}

interface UseTypewriterOptions {
	/** Milissegundos por caractere. */
	speed?: number;
	/** Espera antes de começar a digitar. */
	startDelay?: number;
	/** Só começa quando `true` (para encadear animações). */
	enabled?: boolean;
	onDone?: () => void;
}

export function useTypewriter(
	text: string,
	{
		speed = 40,
		startDelay = 0,
		enabled = true,
		onDone,
	}: UseTypewriterOptions = {},
) {
	const reducedMotion = usePrefersReducedMotion();
	const [count, setCount] = React.useState(0);
	const onDoneRef = React.useRef(onDone);
	onDoneRef.current = onDone;

	React.useEffect(() => {
		if (!enabled) return;

		if (reducedMotion) {
			setCount(text.length);
			onDoneRef.current?.();
			return;
		}

		setCount(0);
		let index = 0;
		let interval: ReturnType<typeof setInterval> | undefined;
		const timeout = setTimeout(() => {
			interval = setInterval(() => {
				index += 1;
				setCount(index);
				if (index >= text.length) {
					clearInterval(interval);
					onDoneRef.current?.();
				}
			}, speed);
		}, startDelay);

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, [text, speed, startDelay, enabled, reducedMotion]);

	return {
		typed: text.slice(0, count),
		done: count >= text.length,
	};
}

/** Cursor do terminal (`_`) piscando — o mesmo do símbolo da marca. */
export function TerminalCursor({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"animate-blink text-ember-500 motion-reduce:animate-none",
				className,
			)}
		>
			_
		</span>
	);
}

interface TypewriterProps extends UseTypewriterOptions {
	text: string;
	className?: string;
	cursorClassName?: string;
	/** Mantém o cursor piscando depois de terminar. */
	keepCursor?: boolean;
}

/**
 * Texto que se digita sozinho. O texto completo fica invisível no mesmo
 * lugar para reservar o espaço (sem pulo de layout) e é o que leitores de
 * tela anunciam.
 */
export function Typewriter({
	text,
	className,
	cursorClassName,
	keepCursor = false,
	...options
}: TypewriterProps) {
	const { typed, done } = useTypewriter(text, options);
	const showCursor = options.enabled !== false && (!done || keepCursor);

	return (
		<span className={cn("inline-grid", className)}>
			<span className="invisible col-start-1 row-start-1">{text}</span>
			<span aria-hidden className="col-start-1 row-start-1">
				{typed}
				{showCursor && <TerminalCursor className={cursorClassName} />}
			</span>
			<span className="sr-only">{text}</span>
		</span>
	);
}
