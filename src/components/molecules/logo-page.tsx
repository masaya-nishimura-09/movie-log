import { BrandShape } from "@/components/atoms/brand-shape";
import { CoverLining } from "@/components/atoms/cover-lining";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { cn } from "@/lib/style/cn";

export function LogoPage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "paper-theme relative isolate z-2 flex min-w-0 items-center justify-center rounded-[2px] bg-paper",
        className,
      )}
    >
      <CoverLining />
      <BrandShape
        shapes={wordmarkShapes}
        ringClassName="fill-(--logo-ring)"
        glyphClassName="fill-foreground"
        className="h-12 w-auto"
      />
    </div>
  );
}
