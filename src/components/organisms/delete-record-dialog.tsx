"use client";

import type { ActionResult } from "@/actions/action-result";
import { DeleteDialog } from "@/components/organisms/delete-dialog";
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
  return (
    <DeleteDialog
      action={action}
      description={interpolate(dict.description, {
        title,
        date: formatDate(watchedAt, lang, "medium"),
      })}
      triggerLabel={triggerLabel}
      dict={dict}
    />
  );
}
