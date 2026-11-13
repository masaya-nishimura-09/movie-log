import type { ReactNode } from "react";
import { phrases } from "@/components/atoms/phrases";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex w-full max-w-110 flex-col items-center gap-3 self-center rounded-[18px] bg-card px-6 pt-7.5 pb-7 text-center">
      <p className="font-bold text-foreground text-lg">{phrases(title)}</p>
      {description && (
        <p className="text-[13px] text-foreground-sub leading-relaxed">
          {phrases(description)}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
