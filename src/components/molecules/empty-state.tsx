import { Clapperboard } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex w-full max-w-110 flex-col items-center gap-3 self-center rounded-[18px] border bg-card px-6 pt-7.5 pb-7 text-center">
      <span className="mb-1 grid size-22 place-items-center rounded-[22px] bg-secondary text-muted-foreground">
        <Clapperboard className="size-7" aria-hidden />
      </span>
      <p className="font-bold text-foreground text-lg">{title}</p>
      {description && (
        <p className="text-[13px] text-foreground-sub leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
