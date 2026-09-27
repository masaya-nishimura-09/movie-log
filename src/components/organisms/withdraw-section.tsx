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

type WithdrawSectionProps = {
  recordCount: number;
  dict: Dictionary["account"];
};

export function WithdrawSection({ recordCount, dict }: WithdrawSectionProps) {
  const description = interpolate(dict.withdrawDescription, {
    count: recordCount,
  });

  return (
    <section className="flex flex-col items-start gap-2 rounded-2xl border border-destructive-border bg-card px-4 py-4.5 md:px-5">
      <h2 className="font-bold font-sans text-[15px] text-destructive-foreground">
        {dict.withdrawTitle}
      </h2>
      <p className="text-[13px] text-foreground-sub">{description}</p>
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="destructive" size="sm" className="mt-2" />}
        >
          {dict.withdrawAction}
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[18px] p-6">
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="font-bold font-heading text-[17px]">
              {dict.withdrawConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-foreground-sub leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.withdrawCancel}</AlertDialogCancel>
            <Button type="button" variant="danger">
              {dict.withdrawConfirm}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
