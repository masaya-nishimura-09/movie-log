"use client";

import { Check } from "lucide-react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { TextLink } from "@/components/atoms/text-link";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { TurnstileWidget } from "@/components/molecules/turnstile-widget";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolateNode } from "@/lib/text/interpolate-node";

type RegisterFormProps = {
  lang: Locale;
  siteKey: string | undefined;
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  dict: Dictionary["register"];
  passwordDict: Dictionary["passwordInput"];
  counterTemplate: string;
};

export function RegisterForm({
  lang,
  siteKey,
  action,
  dict,
  passwordDict,
  counterTemplate,
}: RegisterFormProps) {
  const { failure, pending, submit } = useFormSubmit(action);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <FormField
        label={dict.username}
        htmlFor="username"
        error={failure?.errors?.username && dict.usernameError}
      >
        <CountedInput
          id="username"
          name="username"
          autoComplete="nickname"
          maxLength={100}
          required
          counterTemplate={counterTemplate}
        />
      </FormField>
      <FormField
        label={dict.email}
        htmlFor="email"
        error={failure?.errors?.email && dict.emailError}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>
      <FormField
        label={dict.password}
        htmlFor="password"
        hint={dict.passwordHint}
        error={failure?.errors?.password && dict.passwordError}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 font-medium text-sm">
          <span className="relative grid size-4.25 shrink-0 place-items-center">
            <input
              type="checkbox"
              name="agreedToTerms"
              required
              className="peer size-full appearance-none rounded-[5px] bg-field outline-none checked:bg-selected-border focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Check
              className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 peer-checked:opacity-100"
              strokeWidth={3}
              aria-hidden
            />
          </span>
          <span>
            {interpolateNode(dict.agreeTerms, {
              terms: (
                <TextLink href={`/${lang}/terms`} target="_blank">
                  {dict.termsLink}
                </TextLink>
              ),
            })}
          </span>
        </label>
        <p className="text-muted-foreground text-xs">
          {interpolateNode(dict.privacyNote, {
            privacy: (
              <TextLink href={`/${lang}/privacy`} target="_blank">
                {dict.privacyLink}
              </TextLink>
            ),
          })}
        </p>
      </div>
      <TurnstileWidget lang={lang} siteKey={siteKey} failure={failure} />
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={pending}
      >
        {dict.submit}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        {dict.toLoginPrompt}{" "}
        <TextLink href={`/${lang}/login`}>{dict.toLogin}</TextLink>
      </p>
    </form>
  );
}
