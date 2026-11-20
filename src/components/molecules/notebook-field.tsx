import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type NotebookFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  requiredLabel?: string;
  error?: string;
  labelWidth?: "sm" | "md";
  className?: string;
  children: ReactNode;
};

export function NotebookField({
  label,
  htmlFor,
  required,
  requiredLabel,
  error,
  labelWidth = "md",
  className,
  children,
}: NotebookFieldProps) {
  const LabelTag = htmlFor ? "label" : "span";
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <LabelTag
        htmlFor={htmlFor}
        className={cn(
          "shrink-0 font-semibold text-[11px] leading-7 lg:text-xs",
          labelWidth === "sm" ? "w-16 lg:w-21" : "w-16 lg:w-21.5",
          error ? "text-destructive-foreground" : "text-paper-label",
        )}
      >
        {label}
        {required && (
          <>
            <span aria-hidden className="text-destructive">
              {" "}
              *
            </span>
            {requiredLabel && <span className="sr-only">{requiredLabel}</span>}
          </>
        )}
      </LabelTag>
      <div className="min-w-0 flex-1">
        {children}
        {error && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-[11px] text-destructive-foreground leading-7"
          >
            <CircleAlert className="size-3.25 shrink-0" aria-hidden />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
