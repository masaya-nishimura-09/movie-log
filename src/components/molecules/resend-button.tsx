"use client";

import { useEffect, useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolate } from "@/lib/text/interpolate";

export const resendCooldownSeconds = 60;

const cooldownEnds = new Map<string, number>();

function startCooldown(key: string) {
  cooldownEnds.set(key, Date.now() + resendCooldownSeconds * 1000);
}

function remainingSeconds(key: string): number {
  const end = cooldownEnds.get(key) ?? 0;
  return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

type ResendButtonProps = {
  scope: "verification" | "passwordReset";
  email: string;
  send: (email: string) => Promise<ActionResult<null>>;
  dict: Pick<
    Dictionary["resendVerification"],
    "resend" | "resending" | "cooldown" | "resent" | "resendFailed"
  > &
    Record<string, string>;
  coolingDown?: boolean;
};

export function ResendButton({
  scope,
  email,
  send,
  dict,
  coolingDown = false,
}: ResendButtonProps) {
  const key = `${scope}:${email}`;
  const [remaining, setRemaining] = useState(() => {
    if (coolingDown && !cooldownEnds.has(key)) startCooldown(key);
    return remainingSeconds(key);
  });
  const [result, setResult] = useState<ActionResult<null>>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(remainingSeconds(key)), 1000);
    return () => clearTimeout(timer);
  }, [remaining, key]);

  const resend = () => {
    startTransition(async () => {
      const next = await send(email);
      setResult(next);
      if (!next.success) return;
      startCooldown(key);
      setRemaining(remainingSeconds(key));
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
