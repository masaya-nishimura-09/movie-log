import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/style/cn";

const buttonStyles = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-clip-border bg-primary font-bold text-primary-foreground shadow-[0_3px_0_0_var(--color-primary-edge)] hover:bg-primary/90 active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:translate-y-[3px] active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:shadow-[0_0_0_0_var(--color-primary-edge)]",
        outline:
          "border-input bg-card text-foreground shadow-[0_3px_0_0_var(--color-input)] hover:bg-secondary aria-expanded:bg-secondary active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:translate-y-[3px] active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:shadow-[0_0_0_0_var(--color-input)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "text-foreground-sub hover:bg-secondary hover:text-foreground aria-expanded:bg-secondary",
        destructive:
          "border-destructive-border bg-card text-destructive-foreground shadow-[0_3px_0_0_var(--color-destructive-border)] hover:bg-destructive/5 active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:translate-y-[3px] active:not-aria-[haspopup=menu]:not-aria-[haspopup=listbox]:shadow-[0_0_0_0_var(--color-destructive-border)]",
        danger: "bg-destructive font-bold text-white hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9.5 gap-1.5 rounded-[10px] px-3.5 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonVariants };
