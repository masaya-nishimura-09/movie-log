"use client";

import { Download } from "lucide-react";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { toRecordsCsv } from "@/lib/export/records-csv";
import type { MovieRecord } from "@/schemas/record/record";

type ExportSectionProps = {
  lang: Locale;
  action: () => Promise<ActionResult<MovieRecord[]>>;
  dict: Dictionary["account"];
  csvDict: Pick<Dictionary, "recordForm" | "enums">;
};

function download(text: string, fileName: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportSection({
  lang,
  action,
  dict,
  csvDict,
}: ExportSectionProps) {
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const exportRecords = () => {
    startTransition(async () => {
      const result = await action();
      setFailed(!result.success);
      if (!result.success) return;
      const today = new Date().toLocaleDateString("sv-SE");
      download(
        toRecordsCsv(result.data, lang, csvDict),
        `cinestamp-records-${today}.csv`,
      );
    });
  };

  return (
    <section className="flex flex-col items-start gap-2 rounded-2xl bg-card px-4 py-4.5 md:px-5">
      <h2 className="font-bold text-[15px] text-foreground">
        {dict.exportTitle}
      </h2>
      <p className="text-[13px] text-foreground-sub">
        {dict.exportDescription}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        disabled={pending}
        onClick={exportRecords}
      >
        <Download className="size-4" aria-hidden />
        {pending ? dict.exporting : dict.exportAction}
      </Button>
      {failed && (
        <p role="alert" className="text-destructive-foreground text-sm">
          {dict.exportFailed}
        </p>
      )}
    </section>
  );
}
