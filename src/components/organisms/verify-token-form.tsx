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

function Message({ icon, title, text }: Screen & { icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icon}
      <h1 className="font-bold text-foreground text-xl">{phrases(title)}</h1>
      <output className="text-[13px] text-foreground-sub leading-relaxed">
        {phrases(text)}
      </output>
    </div>
  );
}

export function VerifyTokenForm({
  action,
  hasToken,
  dict,
  failureScreens = {},
  next,
}: VerifyTokenFormProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const nextLink = (variant: "default" | "outline") => (
    <Link
      href={next.href}
      className={buttonVariants({ variant, size: "lg", className: "w-full" })}
    >
      {next.label}
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
        {nextLink("default")}
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
      <div className="flex flex-col gap-6">
        <Message
          icon={
            <CircleAlert
              className="mb-1 size-10 text-destructive-foreground"
              aria-hidden
            />
          }
          {...failureScreen}
        />
        {nextLink("outline")}
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
