"use client";

import Link from "next/link";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { ResultMessage } from "@/components/molecules/result-message";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";

type Screen = { title: string; text: string };

type VerifyTokenFormProps = {
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  hasToken: boolean;
  dict: Pick<
    Dictionary["verifyEmail"],
    | "title"
    | "description"
    | "submit"
    | "submitting"
    | "doneTitle"
    | "doneText"
    | "invalidTitle"
    | "invalidText"
    | "tooManyRequests"
    | "unexpectedError"
  >;
  failureScreens?: Record<string, Screen>;
  next: { href: string; label: string };
};

export function VerifyTokenForm({
  action,
  hasToken,
  dict,
  failureScreens = {},
  next,
}: VerifyTokenFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const nextLink = (
    <Link
      href={next.href}
      className={buttonVariants({ size: "lg", className: "w-full" })}
    >
      {next.label}
    </Link>
  );

  if (state?.success) {
    return (
      <div className="flex flex-col gap-7">
        <ResultMessage
          icon="done"
          title={dict.doneTitle}
          text={dict.doneText}
        />
        {nextLink}
      </div>
    );
  }

  const screens: Record<string, Screen> = {
    invalidToken: { title: dict.invalidTitle, text: dict.invalidText },
    ...failureScreens,
  };
  const failureScreen = hasToken
    ? failure && screens[failure.messageKey]
    : screens.invalidToken;
  if (failureScreen) {
    return (
      <div className="flex flex-col gap-7">
        <ResultMessage icon="failed" {...failureScreen} />
        {nextLink}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <ResultMessage icon="mail" title={dict.title} text={dict.description} />
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
