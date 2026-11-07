import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const Heading = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col gap-1.5", className)}
		{...props}
	/>
));

Heading.displayName = "Heading";

const headingTitleVariants = cva("font-display font-bold text-foreground", {
	variants: {
		size: {
			default: "text-heading-h1",
			sm: "text-heading-h2",
			lg: "text-display-l",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface HeadingTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingTitleVariants> {}

const HeadingTitle = React.forwardRef<HTMLHeadingElement, HeadingTitleProps>(
	({ className, size, ...props }, ref) => (
		<h2
			ref={ref}
			className={cn(headingTitleVariants({ size, className }))}
			{...props}
		/>
	),
);

HeadingTitle.displayName = "HeadingTitle";

const headingDescriptionVariants = cva("text-muted-foreground", {
	variants: {
		size: {
			default: "text-body-m",
			sm: "text-label-s",
			lg: "text-body-l",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface HeadingDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof headingDescriptionVariants> {}

const HeadingDescription = React.forwardRef<
	HTMLParagraphElement,
	HeadingDescriptionProps
>(({ className, size, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(headingDescriptionVariants({ size, className }))}
		{...props}
	/>
));

HeadingDescription.displayName = "HeadingDescription";

/** Rótulo em mono acima do título (ex.: "MEUS PROJETOS / API-PAGAMENTOS"). */
const HeadingEyebrow = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-code-label text-muted-foreground uppercase", className)}
		{...props}
	/>
));

HeadingEyebrow.displayName = "HeadingEyebrow";

export {
	Heading,
	HeadingTitle,
	HeadingDescription,
	HeadingEyebrow,
	headingTitleVariants,
	headingDescriptionVariants,
};
