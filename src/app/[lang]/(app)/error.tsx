"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
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
  const dict = (lang === "en" ? en : ja).errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-10">
      <EmptyState
        title={dict.title}
        description={dict.description}
        action={<Button onClick={retry}>{dict.retry}</Button>}
      />
    </main>
  );
}
