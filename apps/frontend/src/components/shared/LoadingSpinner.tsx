import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
	"inline-block rounded-full border-2 border-muted border-t-primary animate-spin",
	{
		variants: {
			size: {
				sm: "h-4 w-4",
				md: "h-6 w-6",
				lg: "h-8 w-8",
			},
		},
		defaultVariants: {
			size: "md",
		},
	}
);

type LoadingSpinnerProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
	VariantProps<typeof spinnerVariants> & {
		message?: string;
		fullScreen?: boolean;
	};

export function LoadingSpinner({
	className,
	size,
	message = "Carregando...",
	fullScreen = false,
	...props
}: LoadingSpinnerProps) {
	const content = (
		<div
			role="status"
			aria-live="polite"
			aria-label={message}
			className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}
			{...props}
		>
			<span data-slot="spinner" className={spinnerVariants({ size })} />
			<span>{message}</span>
		</div>
	);

	if (!fullScreen) {
		return content;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
			{content}
		</div>
	);
}
