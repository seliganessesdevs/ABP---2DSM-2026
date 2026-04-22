import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const alertVariants = cva("rounded-lg border p-4", {
  variants: {
    variant: {
      error: "border-destructive/40 bg-destructive/10 text-destructive",
      warning: "border-chart-3/40 bg-chart-3/10 text-foreground",
      info: "border-border bg-card text-foreground",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

type ErrorAlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    message: ReactNode;
    retryLabel?: string;
    onRetry?: () => void;
    dismissible?: boolean;
    onDismiss?: () => void;
  };

export function ErrorAlert({
  className,
  variant,
  title = "Algo deu errado",
  message,
  retryLabel = "Tentar novamente",
  onRetry,
  dismissible = false,
  onDismiss,
  ...props
}: ErrorAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const Icon = useMemo(() => {
    if (variant === "warning") return AlertTriangle;
    if (variant === "info") return Info;
    return AlertCircle;
  }, [variant]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), "flex items-start gap-3", className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />

      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-semibold">{title}</p>
        <div className="text-sm leading-6">{message}</div>

        <div className="flex items-center gap-2">
          {onRetry ? (
            <Button size="sm" variant="outline" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}

          {dismissible ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsDismissed(true);
                onDismiss?.();
              }}
            >
              Fechar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
