"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
import { AccountSection } from "@/components/molecules/account-section";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import type { Dictionary } from "@/i18n/get-dictionary";

type WithdrawSectionProps = {
  action: () => Promise<ActionResult<never>>;
  dict: Dictionary["account"];
};

export function WithdrawSection({ action, dict }: WithdrawSectionProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <AccountSection
      title={dict.withdrawTitle}
      description={dict.withdrawDescription}
      danger
    >
      <AlertDialog
        onOpenChange={(open, details) => {
          if (!open && pending) details.cancel();
        }}
      >
        <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
          {dict.withdrawAction}
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[18px] p-6">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="font-bold text-[17px]">
              {dict.withdrawConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
              {phrases(dict.withdrawDescription)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {state?.success === false && (
            <p role="alert" className="text-destructive-foreground text-sm">
              {phrases(dict.withdrawFailed)}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              {dict.withdrawCancel}
            </AlertDialogCancel>
            <form action={formAction}>
              <Button
                type="submit"
                variant="danger"
                pending={pending}
                pendingLabel={dict.withdrawing}
                className="w-full"
              >
                {dict.withdrawConfirm}
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountSection>
  );
}
