import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/style/cn";

const textLinkStyles = cva(
  "rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      tone: {
        primary: "text-primary",
        muted: "text-foreground-sub",
      },
    },
    defaultVariants: { tone: "primary" },
  },
);

type TextLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof textLinkStyles>;

export function TextLink({ tone, className, ...props }: TextLinkProps) {
  return (
    <Link className={cn(textLinkStyles({ tone }), className)} {...props} />
  );
}
