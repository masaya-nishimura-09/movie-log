import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { PendingContent } from "@/components/atoms/pending-content";
import { cn } from "@/lib/style/cn";

const buttonStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary font-semibold text-primary-foreground hover:bg-primary-edge",
        outline:
          "text-foreground shadow-[inset_0_0_0_1px_var(--outline)] hover:bg-secondary aria-expanded:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "text-foreground hover:bg-secondary aria-expanded:bg-secondary",
        destructive:
          "text-destructive-foreground shadow-[inset_0_0_0_1px_var(--destructive-border)] hover:bg-destructive/5",
        danger:
          "bg-destructive font-semibold text-primary-foreground hover:bg-destructive-edge",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-1.5 rounded-[10px] px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-1.5 rounded-[10px] px-3.5 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-12 gap-1.5 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function buttonVariants(props?: Parameters<typeof buttonStyles>[0]) {
  return cn(buttonStyles(props));
}

function Button({
  className,
  variant = "default",
  size = "default",
  pending = false,
  pendingLabel,
  disabled,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    pending?: boolean;
    pendingLabel?: ReactNode;
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...(pending && {
        children: (
          <PendingContent
            pending
            label={props.children}
            pendingLabel={pendingLabel}
          />
        ),
      })}
    />
  );
}

export { Button, buttonVariants };
