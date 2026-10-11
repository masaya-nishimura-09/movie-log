"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { buttonVariants } from "@/components/atoms/button";
import { hasInAppHistory } from "@/lib/navigation/in-app-history";
import { cn } from "@/lib/style/cn";

type BackButtonProps = {
  fallbackHref: string;
  label: string;
  className?: string;
};

export function BackButton({
  fallbackHref,
  label,
  className,
}: BackButtonProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!hasInAppHistory()) return;
    event.preventDefault();
    router.back();
  }

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      className={cn(buttonVariants({ variant: "outline" }), className)}
    >
      <ArrowLeft aria-hidden />
      {label}
    </Link>
  );
}
