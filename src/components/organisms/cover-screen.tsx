import Link from "next/link";
import type { ReactNode } from "react";
import { CoverLining } from "@/components/atoms/cover-lining";
import { Logo } from "@/components/atoms/logo";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import { cn } from "@/lib/style/cn";

type CoverScreenProps = {
  homeHref: string;
  brandName: string;
  children: ReactNode;
};

export function CoverScreen({
  homeHref,
  brandName,
  children,
}: CoverScreenProps) {
  const logo = (
    <Link
      href={homeHref}
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Logo name={brandName} className="h-10 md:h-12" />
    </Link>
  );

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8 md:px-8 md:py-12">
      <RingNotebook
        variant="responsive"
        className="h-auto max-w-110 max-lg:self-stretch lg:w-full lg:max-w-220"
      >
        <div className="paper-theme relative isolate z-2 hidden min-w-0 flex-1 basis-0 items-center justify-center rounded-[2px] bg-paper px-12 lg:flex">
          <CoverLining />
          {logo}
        </div>
        <div
          className={cn(
            "paper-theme relative isolate z-2 flex min-h-84 flex-col justify-center overflow-hidden rounded-[3px] bg-paper px-6 py-14 text-paper-ink lg:min-h-140 lg:min-w-0 lg:flex-1 lg:basis-0 lg:rounded-[2px] lg:px-12",
            "[&_:is(h1,h2,p,a,label,li,legend)]:leading-7 [&_[data-slot=form-field-label]]:pb-0",
          )}
        >
          <div className="mb-8 flex justify-center lg:hidden">{logo}</div>
          <div className="relative">{children}</div>
        </div>
      </RingNotebook>
    </main>
  );
}
