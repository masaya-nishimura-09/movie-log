import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { cn } from "@/lib/style/cn";

export function Logo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className="inline-flex">
      <BrandShape
        shapes={wordmarkShapes}
        ringClassName="fill-(--logo-ring)"
        glyphClassName="fill-foreground"
        className={cn("h-10 w-auto", className)}
      />
      <span className="sr-only">{name}</span>
    </span>
  );
}
