"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { phrases } from "@/components/atoms/phrases";
import en from "@/i18n/dictionaries/en.json";
import ja from "@/i18n/dictionaries/ja.json";
import { cn } from "@/lib/style/cn";
import { paperCard, ruledLines } from "@/lib/style/paper";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { lang } = useParams<{ lang: string }>();
  const dict = (lang === "en" ? en : ja).errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-start justify-center px-4 py-16">
      <div className={cn(paperCard, ruledLines, "max-w-100")}>
        <MaskingTape className="w-24" />
        <h1 className="font-bold font-display text-lg leading-7">
          {dict.title}
        </h1>
        <p className="mt-3.5 text-[13px] text-foreground-sub leading-7">
          {phrases(dict.description)}
        </p>
        <Button onClick={retry} className="mt-3.5 w-full">
          {dict.retry}
        </Button>
      </div>
    </div>
  );
}
