"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
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
    <section className="flex flex-col items-start gap-2 rounded-2xl border border-destructive-border bg-card px-4 py-4.5 md:px-5">
      <h2 className="font-bold text-[15px] text-destructive-foreground">
        {dict.withdrawTitle}
      </h2>
      <p className="text-[13px] text-foreground-sub">
        {dict.withdrawDescription}
      </p>
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="destructive" size="sm" className="mt-2" />}
        >
          {dict.withdrawAction}
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[18px] p-6">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="font-bold text-[17px]">
              {dict.withdrawConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
              {dict.withdrawDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {state?.success === false && (
            <p role="alert" className="text-destructive-foreground text-sm">
              {dict.withdrawFailed}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.withdrawCancel}</AlertDialogCancel>
            <form action={formAction}>
              <Button
                type="submit"
                variant="danger"
                disabled={pending}
                className="w-full"
              >
                {dict.withdrawConfirm}
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
