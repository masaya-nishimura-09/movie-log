"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/locales";

type Turnstile = {
  render: (
    container: HTMLElement,
    options: { sitekey: string; language: string; theme: "auto" },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

type TurnstileWidgetProps = {
  lang: Locale;
  siteKey: string | undefined;
  failure: unknown;
};

export function TurnstileWidget({
  lang,
  siteKey,
  failure,
}: TurnstileWidgetProps) {
  const [scriptReady, setScriptReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  useEffect(() => {
    const turnstile = window.turnstile;
    if (!scriptReady || !siteKey || !turnstile || !widgetRef.current) return;
    const id = turnstile.render(widgetRef.current, {
      sitekey: siteKey,
      language: lang,
      theme: "auto",
    });
    widgetId.current = id;
    return () => turnstile.remove(id);
  }, [scriptReady, siteKey, lang]);

  useEffect(() => {
    if (failure && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [failure]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setScriptReady(true)}
      />
      <div ref={widgetRef} className="min-h-[65px]" />
    </>
  );
}
