"use client";

import { CircleAlert, CircleCheck, MailCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { phrases } from "@/components/atoms/phrases";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { dictMessage } from "@/lib/text/dict-message";

type VerifyEmailFormProps = {
  lang: Locale;
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  hasToken: boolean;
  dict: Dictionary["verifyEmail"];
};

function Message({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icon}
      <h1 className="font-bold text-foreground text-xl">{title}</h1>
      <output className="text-[13px] text-foreground-sub leading-relaxed">
        {phrases(text)}
      </output>
    </div>
  );
}

export function VerifyEmailForm({
  lang,
  action,
  hasToken,
  dict,
}: VerifyEmailFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const toLogin = (variant: "default" | "outline") => (
    <Link
      href={`/${lang}/login`}
      className={buttonVariants({ variant, size: "lg", className: "w-full" })}
    >
      {dict.toLogin}
    </Link>
  );

  if (state?.success) {
    return (
      <div className="flex flex-col gap-6">
        <Message
          icon={
            <CircleCheck className="mb-1 size-10 text-primary" aria-hidden />
          }
          title={dict.doneTitle}
          text={dict.doneText}
        />
        {toLogin("default")}
      </div>
    );
  }

  if (!hasToken || failure?.messageKey === "invalidToken") {
    return (
      <div className="flex flex-col gap-6">
        <Message
          icon={
            <CircleAlert
              className="mb-1 size-10 text-destructive-foreground"
              aria-hidden
            />
          }
          title={dict.invalidTitle}
          text={dict.invalidText}
        />
        {toLogin("outline")}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Message
        icon={<MailCheck className="mb-1 size-10 text-primary" aria-hidden />}
        title={dict.title}
        text={dict.description}
      />
      {failure && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        pending={pending}
        pendingLabel={dict.submitting}
      >
        {dict.submit}
      </Button>
    </form>
  );
}
