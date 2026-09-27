import type { ReactNode } from "react";
import { Label } from "@/components/atoms/label";
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
    <div className={cn("flex flex-col gap-1.25", className)}>
      <Label
        htmlFor={htmlFor}
        className="gap-0 font-medium text-[13px] text-foreground leading-normal"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" title={requiredLabel}>
            *
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p
          className="mt-0.5 flex items-center gap-1.5 text-destructive-foreground text-xs"
          role="alert"
        >
          {error}
        </p>
      ) : (
        hint && <p className="mt-0.5 text-muted-foreground text-xs">{hint}</p>
      )}
    </div>
  );
}
