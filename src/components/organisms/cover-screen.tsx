import Link from "next/link";
import type { ReactNode } from "react";
import { CoverSpine } from "@/components/atoms/cover-spine";
import { CoverTexture } from "@/components/atoms/cover-texture";
import { Logo } from "@/components/atoms/logo";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { cn } from "@/lib/style/cn";
import {
  coverSurface,
  onCover,
  paperCard,
  ruledLines,
} from "@/lib/style/paper";

type CoverScreenProps = {
  homeHref: string;
  brandName: string;
  wide?: boolean;
  children: ReactNode;
};

export function CoverScreen({
  homeHref,
  brandName,
  wide = false,
  children,
}: CoverScreenProps) {
  return (
    <main className="flex flex-1 items-center justify-center bg-background px-4 py-6 md:px-8 md:py-10">
      <div
        className={cn(
          coverSurface,
          "relative flex min-h-[calc(100svh-3rem)] w-full flex-col items-center justify-center px-4 py-10 md:min-h-195 md:px-12",
          wide ? "max-w-220 md:py-12" : "max-w-140",
        )}
      >
        <CoverSpine />
        <CoverTexture />
        <div className={cn("relative mb-7 text-center", onCover)}>
          <Link
            href={homeHref}
            className="rounded-sm outline-none focus-visible:ring-(--beige) focus-visible:ring-2"
          >
            <Logo name={brandName} className="h-10 md:h-12" />
          </Link>
        </div>
        <div
          className={cn(
            paperCard,
            ruledLines,
            wide ? "max-w-180" : "max-w-100",
          )}
        >
          <MaskingTape className="w-24" />
          {children}
        </div>
      </div>
    </main>
  );
}
