"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { CountedTextarea } from "@/components/molecules/counted-textarea";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import {
  contactMessageMaxLength,
  honeypotField,
} from "@/schemas/contact/contact";

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

type ContactFormProps = {
  lang: Locale;
  siteKey: string | undefined;
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  dict: Dictionary["contact"];
  counterTemplate: string;
};

export function ContactForm({
  lang,
  siteKey,
  action,
  dict,
  counterTemplate,
}: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [scriptReady, setScriptReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const failure = state?.success === false ? state : undefined;
  const message = (key: string | undefined) =>
    key && key in dict ? dict[key as keyof typeof dict] : undefined;

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

  if (state?.success) {
    return (
      <output className="flex flex-col items-center gap-2 text-center">
        <p className="font-bold text-base text-foreground">
          {dict.successTitle}
        </p>
        <p className="text-[13px] text-foreground-sub leading-relaxed">
          {dict.successText}
        </p>
      </output>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={() => setScriptReady(true)}
        />
      )}
      {failure && !failure.errors && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm"
        >
          {message(failure.messageKey) ?? dict.unexpectedError}
        </p>
      )}
      <FormField
        label={dict.email}
        htmlFor="email"
        hint={dict.emailHint}
        error={message(failure?.errors?.email?.[0])}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(failure?.errors?.email)}
        />
      </FormField>
      <FormField
        label={dict.message}
        htmlFor="message"
        error={message(failure?.errors?.message?.[0])}
      >
        <CountedTextarea
          id="message"
          name="message"
          required
          maxLength={contactMessageMaxLength}
          counterTemplate={counterTemplate}
          aria-invalid={Boolean(failure?.errors?.message)}
        />
      </FormField>
      <div
        aria-hidden
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={honeypotField}>{honeypotField}</label>
        <input
          id={honeypotField}
          name={honeypotField}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {siteKey && <div ref={widgetRef} className="min-h-[65px]" />}
      <Button type="submit" disabled={pending}>
        {dict.submit}
      </Button>
    </form>
  );
}
