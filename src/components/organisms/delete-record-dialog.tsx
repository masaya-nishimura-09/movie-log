import { Trash2 } from "lucide-react";
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
import { interpolate } from "@/lib/text/interpolate";

type DeleteRecordDialogProps = {
  title: string;
  watchedLabel: string;
  triggerLabel: string;
  dict: Dictionary["deleteRecord"];
};

export function DeleteRecordDialog({
  title,
  watchedLabel,
  triggerLabel,
  dict,
}: DeleteRecordDialogProps) {
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
          <AlertDialogTitle className="font-bold font-heading text-[17px]">
            {dict.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
            {interpolate(dict.description, { title, date: watchedLabel })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{dict.cancel}</AlertDialogCancel>
          <Button type="button" variant="danger">
            {dict.confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
