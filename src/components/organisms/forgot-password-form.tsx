"use client";

import type { ActionResult } from "@/actions/action-result";
import { resendPasswordResetAction } from "@/actions/user/request-password-reset";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { phrases } from "@/components/atoms/phrases";
import { TextLink } from "@/components/atoms/text-link";
import { FormField } from "@/components/molecules/form-field";
import { ResendButton } from "@/components/molecules/resend-button";
import { ResultMessage } from "@/components/molecules/result-message";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formStack } from "@/lib/style/paper";
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
      <div className="flex flex-col gap-7">
        <ResultMessage
          icon="mail"
          title={dict.sentTitle}
          text={
            <>
              {phrases(sentBefore)}
              <span className="break-all font-medium text-foreground">
                {state.data.email}
              </span>
              {phrases(sentAfter)}
            </>
          }
          note={dict.sentNote}
        />
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
      <div className="flex flex-col">
        <h1 className="font-bold font-display text-foreground text-lg leading-7">
          {dict.title}
        </h1>
        <p className="text-muted-foreground text-xs">
          {phrases(dict.description)}
        </p>
      </div>
      <form onSubmit={submit} noValidate className={formStack}>
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
