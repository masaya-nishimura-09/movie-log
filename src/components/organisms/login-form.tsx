"use client";

import { useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { resendVerificationEmailAction } from "@/actions/user/resend-verification-email";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { TextLink } from "@/components/atoms/text-link";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { ResendButton } from "@/components/molecules/resend-button";
import { TurnstileWidget } from "@/components/molecules/turnstile-widget";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formStack } from "@/lib/style/paper";
import { dictMessage } from "@/lib/text/dict-message";

type LoginFormProps = {
  lang: Locale;
  siteKey: string | undefined;
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  dict: Dictionary["login"];
  passwordDict: Dictionary["passwordInput"];
  resendDict: Dictionary["resendVerification"];
};

export function LoginForm({
  lang,
  siteKey,
  action,
  dict,
  passwordDict,
  resendDict,
}: LoginFormProps) {
  const submittedEmail = useRef("");
  const [unverifiedEmail, setUnverifiedEmail] = useState<string>();
  const { failure, pending, submit } = useFormSubmit(action, (formData) => {
    submittedEmail.current = String(formData.get("email") ?? "");
  });

  useEffect(() => {
    setUnverifiedEmail(
      failure?.messageKey === "emailNotVerified"
        ? submittedEmail.current
        : undefined,
    );
  }, [failure]);

  return (
    <form onSubmit={submit} noValidate className={formStack}>
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      {unverifiedEmail && (
        <ResendButton
          key={unverifiedEmail}
          scope="verification"
          email={unverifiedEmail}
          send={(email) => resendVerificationEmailAction(lang, email)}
          dict={resendDict}
        />
      )}
      <FormField
        label={dict.email}
        htmlFor="email"
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
        label={dict.password}
        htmlFor="password"
        hint={dict.passwordHint}
        error={dictMessage(dict, failure?.errors?.password?.[0])}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          minLength={8}
          maxLength={72}
          required
          aria-invalid={Boolean(failure?.errors?.password)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <TextLink
        href={`/${lang}/forgot-password`}
        className="self-end text-xs leading-7"
      >
        {dict.forgotPassword}
      </TextLink>
      <TurnstileWidget lang={lang} siteKey={siteKey} failure={failure} />
      <Button
        type="submit"
        size="lg"
        className="w-full"
        pending={pending}
        pendingLabel={dict.submitting}
      >
        {dict.submit}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        {dict.toRegisterPrompt}{" "}
        <TextLink href={`/${lang}/register`}>{dict.toRegister}</TextLink>
      </p>
    </form>
  );
}
