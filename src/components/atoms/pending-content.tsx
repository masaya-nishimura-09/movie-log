import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/style/cn";

type PendingContentProps = {
  pending: boolean;
  icon?: ReactNode;
  iconClassName?: string;
  label: ReactNode;
  pendingLabel?: ReactNode;
};

export function PendingContent({
  pending,
  icon,
  iconClassName,
  label,
  pendingLabel,
}: PendingContentProps) {
  if (!pending) {
    return (
      <>
        {icon}
        {label}
      </>
    );
  }
  return (
    <>
      <LoaderCircle
        aria-hidden
        data-spinner=""
        className={cn("animate-spin", iconClassName)}
      />
      {pendingLabel ?? label}
    </>
  );
}
