"use client";

import { Trash2 } from "lucide-react";
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
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { interpolate } from "@/lib/text/interpolate";

type DeleteRecordDialogProps = {
  action: () => Promise<ActionResult<never>>;
  title: string;
  watchedAt: string;
  lang: Locale;
  triggerLabel: string;
  dict: Dictionary["deleteRecord"];
};

export function DeleteRecordDialog({
  action,
  title,
  watchedAt,
  lang,
  triggerLabel,
  dict,
}: DeleteRecordDialogProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="sm"
            aria-label={triggerLabel}
            className="border-transparent bg-transparent px-2 md:border-destructive-border md:bg-card md:px-3.5"
          />
        }
      >
        <Trash2 className="size-4.5" aria-hidden />
        <span className="hidden md:inline">{triggerLabel}</span>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[18px] p-6">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="font-bold text-[17px]">
            {dict.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
            {interpolate(dict.description, {
              title,
              date: formatDate(watchedAt, lang, "medium"),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {state?.success === false && (
          <p role="alert" className="text-destructive-foreground text-sm">
            {dict.unexpectedError}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{dict.cancel}</AlertDialogCancel>
          <form action={formAction}>
            <Button
              type="submit"
              variant="danger"
              disabled={pending}
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
