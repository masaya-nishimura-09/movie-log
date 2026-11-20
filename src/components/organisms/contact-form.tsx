"use client";

import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { phrases } from "@/components/atoms/phrases";
import { CountedTextarea } from "@/components/molecules/counted-textarea";
import { FormField } from "@/components/molecules/form-field";
import { TurnstileWidget } from "@/components/molecules/turnstile-widget";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formStack } from "@/lib/style/paper";
import { dictMessage } from "@/lib/text/dict-message";
import {
  contactMessageMaxLength,
  honeypotField,
} from "@/schemas/contact/contact";

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
  const { state, failure, pending, submit } = useFormSubmit(action);

  if (state?.success) {
    return (
      <output className="flex flex-col">
        <h1 className="font-bold font-display text-foreground text-lg leading-7">
          {dict.successTitle}
        </h1>
        <p className="text-[13px] text-foreground-sub leading-7">
          {phrases(dict.successText)}
        </p>
      </output>
    );
  }

  return (
    <>
      <header className="mb-3.5 flex flex-col">
        <h1 className="font-bold font-display text-foreground text-lg leading-7">
          {dict.title}
        </h1>
        <p className="text-[13px] text-foreground-sub leading-7">
          {phrases(dict.intro)}
        </p>
      </header>
      <form onSubmit={submit} noValidate className={formStack}>
        {failure && !failure.errors && (
          <FormAlert>
            {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
          </FormAlert>
        )}
        <FormField
          label={dict.email}
          htmlFor="email"
          hint={dict.emailHint}
          error={dictMessage(dict, failure?.errors?.email?.[0])}
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
          error={dictMessage(dict, failure?.errors?.message?.[0])}
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
        <TurnstileWidget lang={lang} siteKey={siteKey} failure={failure} />
        <Button type="submit" pending={pending} pendingLabel={dict.submitting}>
          {dict.submit}
        </Button>
      </form>
    </>
  );
}
