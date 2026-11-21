import type { ReactNode } from "react";
import { Label } from "@/components/atoms/label";
import { phrases } from "@/components/atoms/phrases";
import { cn } from "@/lib/style/cn";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  requiredLabel?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required,
  requiredLabel,
  hint,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex min-h-7 flex-wrap items-end justify-between gap-x-3 pb-1">
        <Label
          htmlFor={htmlFor}
          className="gap-0 font-semibold text-paper-label text-xs leading-normal dark:text-link"
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" title={requiredLabel}>
              *
            </span>
          )}
        </Label>
        {hint && !error && (
          <span className="text-muted-foreground text-xs">{phrases(hint)}</span>
        )}
      </div>
      {children}
      {error && (
        <p
          className="flex items-center gap-1.5 text-destructive-foreground text-xs leading-7"
          role="alert"
        >
          {phrases(error)}
        </p>
      )}
    </div>
  );
}
