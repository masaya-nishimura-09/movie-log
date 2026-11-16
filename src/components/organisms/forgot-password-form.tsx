"use client";

import { MailCheck } from "lucide-react";
import type { ActionResult } from "@/actions/action-result";
import { resendPasswordResetAction } from "@/actions/user/request-password-reset";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { phrases } from "@/components/atoms/phrases";
import { TextLink } from "@/components/atoms/text-link";
import { FormField } from "@/components/molecules/form-field";
import { ResendButton } from "@/components/molecules/resend-button";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { dictMessage } from "@/lib/text/dict-message";

type ForgotPasswordFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<{ email: string }> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<{ email: string }>>;
  dict: Dictionary["forgotPassword"];
  resendDict: Dictionary["resendPasswordReset"];
};

export function ForgotPasswordForm({
  lang,
  action,
  dict,
  resendDict,
}: ForgotPasswordFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const toLogin = (
    <TextLink href={`/${lang}/login`} className="self-center text-sm">
      {dict.toLogin}
    </TextLink>
  );

  if (state?.success) {
    const [sentBefore = "", sentAfter = ""] = dict.sentText.split("{email}");
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <MailCheck className="mb-1 size-10 text-primary" aria-hidden />
          <h1 className="font-bold text-foreground text-xl">
            {dict.sentTitle}
          </h1>
          <output className="text-[13px] text-foreground-sub leading-relaxed">
            {phrases(sentBefore)}
            <span className="break-all font-medium text-foreground">
              {state.data.email}
            </span>
            {phrases(sentAfter)}
          </output>
          <p className="text-[13px] text-foreground-sub leading-relaxed">
            {phrases(dict.sentNote)}
          </p>
        </div>
        <ResendButton
          scope="passwordReset"
          email={state.data.email}
          send={(email) => resendPasswordResetAction(lang, email)}
          dict={resendDict}
          coolingDown
        />
        {toLogin}
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
            aria-invalid={Boolean(failure?.errors?.email)}
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
        {toLogin}
      </form>
    </>
  );
}
