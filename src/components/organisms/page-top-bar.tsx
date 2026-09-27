import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PageTopBarProps = {
  backHref: string;
  backLabel: string;
  title?: string;
  actions?: ReactNode;
};

export function PageTopBar({
  backHref,
  backLabel,
  title,
  actions,
}: PageTopBarProps) {
  return (
    <header className="sticky top-0 z-40 border-input border-b bg-header">
      <div className="flex h-14 items-center gap-3.5 px-4 md:h-15 md:px-6">
        <Link
          href={backHref}
          aria-label={title ? backLabel : undefined}
          className="-ml-1 flex items-center gap-3.5 rounded-sm p-1 text-foreground-sub text-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-5.25" aria-hidden />
          {!title && <span className="hidden md:inline">{backLabel}</span>}
        </Link>
        {title && (
          <h1 className="font-bold text-[17px] text-foreground">{title}</h1>
        )}
        {actions && (
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
