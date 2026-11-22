import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { cn } from "@/lib/style/cn";

export function LogoPage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "paper-theme flex min-w-0 items-center justify-center rounded-[2px] bg-paper",
        className,
      )}
    >
      <BrandShape
        shapes={wordmarkShapes}
        ringClassName="fill-(--logo-ring)"
        glyphClassName="fill-foreground"
        className="h-12 w-auto"
      />
    </div>
  );
}
