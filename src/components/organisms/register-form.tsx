"use client";

import Link from "next/link";
import { type FormEvent, startTransition, useActionState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type RegisterFormProps = {
  lang: Locale;
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
  action,
  dict,
  passwordDict,
  counterTemplate,
}: RegisterFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const failure = state?.success === false ? state : undefined;
  const message = (key: string) =>
    key in dict ? dict[key as keyof typeof dict] : dict.unexpectedError;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {failure && !failure.errors && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm"
        >
          {message(failure.messageKey)}
        </p>
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
        <Link
          href={`/${lang}/login`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {dict.toLogin}
        </Link>
      </p>
    </form>
  );
}
