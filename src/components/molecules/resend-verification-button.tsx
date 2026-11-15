"use client";

import { useEffect, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { resendVerificationEmailAction } from "@/actions/user/resend-verification-email";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolate } from "@/lib/text/interpolate";

export const resendCooldownSeconds = 60;

const cooldownEnds = new Map<string, number>();

function startCooldown(email: string) {
  cooldownEnds.set(email, Date.now() + resendCooldownSeconds * 1000);
}

function remainingSeconds(email: string): number {
  const end = cooldownEnds.get(email) ?? 0;
  return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

type ResendVerificationButtonProps = {
  lang: Locale;
  email: string;
  dict: Dictionary["resendVerification"];
  coolingDown?: boolean;
};

export function ResendVerificationButton({
  lang,
  email,
  dict,
  coolingDown = false,
}: ResendVerificationButtonProps) {
  const [remaining, setRemaining] = useState(() => {
    if (coolingDown && !cooldownEnds.has(email)) startCooldown(email);
    return remainingSeconds(email);
  });
  const [result, setResult] = useState<ActionResult<null>>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(remainingSeconds(email)), 1000);
    return () => clearTimeout(timer);
  }, [remaining, email]);

  const resend = () => {
    startTransition(async () => {
      const next = await resendVerificationEmailAction(lang, email);
      setResult(next);
      if (!next.success) return;
      startCooldown(email);
      setRemaining(remainingSeconds(email));
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {result?.success && (
        <output className="text-center text-foreground-sub text-sm">
          {dict.resent}
        </output>
      )}
      {result?.success === false && (
        <FormAlert>
          {dictMessage(dict, result.messageKey) ?? dict.resendFailed}
        </FormAlert>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={resend}
        disabled={remaining > 0}
        pending={pending}
        pendingLabel={dict.resending}
      >
        {remaining > 0
          ? interpolate(dict.cooldown, { seconds: remaining })
          : dict.resend}
      </Button>
    </div>
  );
}
