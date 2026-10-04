"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type LoginFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  dict: Dictionary["login"];
  passwordDict: Dictionary["passwordInput"];
};

export function LoginForm({
  lang,
  action,
  dict,
  passwordDict,
}: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [email, setEmail] = useState("");
  const failure = state?.success === false ? state : undefined;
  const message = (key: string | undefined) =>
    key && key in dict ? dict[key as keyof typeof dict] : undefined;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
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
        error={message(failure?.errors?.email?.[0])}
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(failure?.errors?.email)}
        />
      </FormField>
      <FormField
        label={dict.password}
        htmlFor="password"
        hint={dict.passwordHint}
        error={message(failure?.errors?.password?.[0])}
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
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={pending}
      >
        {dict.submit}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        {dict.toRegisterPrompt}{" "}
        <Link
          href={`/${lang}/register`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {dict.toRegister}
        </Link>
      </p>
    </form>
  );
}
