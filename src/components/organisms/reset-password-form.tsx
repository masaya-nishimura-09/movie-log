"use client";

import Link from "next/link";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { phrases } from "@/components/atoms/phrases";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { ResultMessage } from "@/components/molecules/result-message";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { dictMessage } from "@/lib/text/dict-message";

type ResetPasswordFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  hasToken: boolean;
  dict: Dictionary["resetPassword"];
  passwordDict: Dictionary["passwordInput"];
};

export function ResetPasswordForm({
  lang,
  action,
  hasToken,
  dict,
  passwordDict,
}: ResetPasswordFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);

  if (state?.success) {
    return (
      <div className="flex flex-col gap-6">
        <ResultMessage
          icon="done"
          title={dict.doneTitle}
          text={dict.doneText}
        />
        <Link
          href={`/${lang}/login`}
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          {dict.toLogin}
        </Link>
      </div>
    );
  }

  if (!hasToken || failure?.messageKey === "invalidToken") {
    return (
      <div className="flex flex-col gap-6">
        <ResultMessage
          icon="failed"
          title={dict.invalidTitle}
          text={dict.invalidText}
        />
        <Link
          href={`/${lang}/forgot-password`}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className: "w-full",
          })}
        >
          {dict.toRequest}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-bold text-foreground text-xl">{dict.title}</h1>
        <p className="text-muted-foreground text-xs">
          {phrases(dict.description)}
        </p>
      </div>
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        {failure && !failure.errors && (
          <FormAlert>
            {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
          </FormAlert>
        )}
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
            aria-invalid={Boolean(failure?.errors?.password)}
            showLabel={passwordDict.show}
            hideLabel={passwordDict.hide}
          />
        </FormField>
        <Button
          type="submit"
          size="lg"
          className="mt-1 w-full"
          pending={pending}
          pendingLabel={dict.submitting}
        >
          {dict.submit}
        </Button>
      </form>
    </>
  );
}
