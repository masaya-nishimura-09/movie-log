import { BrandShape } from "@/components/atoms/brand-shape";
import { markShapes, wordmarkShapes } from "@/components/atoms/logo-shapes";
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

export function LogoMark({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className="inline-flex">
      <BrandShape
        shapes={markShapes}
        ringClassName="fill-(--logo-ring)"
        glyphClassName="fill-foreground"
        className={cn("size-8", className)}
      />
      <span className="sr-only">{name}</span>
    </span>
  );
}
