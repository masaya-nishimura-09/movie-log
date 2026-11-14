"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
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

type DeleteDialogProps = {
  action: () => Promise<ActionResult<null>>;
  description: string;
  triggerLabel: string;
  triggerClassName?: string;
  iconOnly?: boolean;
  onPendingChange?: (pending: boolean) => void;
  dict: {
    title: string;
    cancel: string;
    confirm: string;
    deleting: string;
    unexpectedError: string;
  };
};

export function DeleteDialog({
  action,
  description,
  triggerLabel,
  triggerClassName,
  iconOnly = false,
  onPendingChange,
  dict,
}: DeleteDialogProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  return (
    <AlertDialog
      onOpenChange={(open, details) => {
        if (!open && pending) details.cancel();
      }}
    >
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="sm"
            aria-label={triggerLabel}
            className={triggerClassName ?? "px-2.5 md:px-3.5"}
          />
        }
      >
        <Trash2 className="size-4.5" aria-hidden />
        {!iconOnly && <span className="hidden md:inline">{triggerLabel}</span>}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[18px] p-6">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="font-bold text-[17px]">
            {dict.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
            {phrases(description)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state?.success === false && (
          <p role="alert" className="text-destructive-foreground text-sm">
            {phrases(dict.unexpectedError)}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {dict.cancel}
          </AlertDialogCancel>
          <form action={formAction}>
            <Button
              type="submit"
              variant="danger"
              pending={pending}
              pendingLabel={dict.deleting}
              className="w-full"
            >
              {dict.confirm}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
