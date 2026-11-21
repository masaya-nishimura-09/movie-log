"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
import { CoverScreen } from "@/components/organisms/cover-screen";
import en from "@/i18n/dictionaries/en.json";
import ja from "@/i18n/dictionaries/ja.json";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { lang } = useParams<{ lang: string }>();
  const dict = lang === "en" ? en : ja;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CoverScreen homeHref={`/${lang}`} brandName={dict.brand.name}>
      <h1 className="font-bold font-display text-lg leading-7">
        {dict.errorPage.title}
      </h1>
      <p className="text-[13px] text-foreground-sub leading-7">
        {phrases(dict.errorPage.description)}
      </p>
      <Button onClick={retry} className="my-1.5 w-full">
        {dict.errorPage.retry}
      </Button>
    </CoverScreen>
  );
}
