"use client";

import { strToU8, zipSync } from "fflate";
import { Download } from "lucide-react";
import { useState, useTransition } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { articleFiles } from "@/lib/export/article-markdown";
import { toRecordsCsv } from "@/lib/export/records-csv";
import type { Article } from "@/schemas/article/article";
import type { MovieRecord } from "@/schemas/record/record";

type ExportSectionProps = {
  lang: Locale;
  exportRecords: () => Promise<ActionResult<MovieRecord[]>>;
  exportArticles: () => Promise<ActionResult<Article[]>>;
  dict: Dictionary["account"];
  csvDict: Pick<Dictionary, "recordForm" | "enums">;
  releaseYearTemplate: string;
};

function download(data: BlobPart, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportSection({
  lang,
  exportRecords,
  exportArticles,
  dict,
  csvDict,
  releaseYearTemplate,
}: ExportSectionProps) {
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [running, setRunning] = useState<"records" | "articles">();
  const today = () => new Date().toLocaleDateString("sv-SE");

  const run = (kind: "records" | "articles") => {
    setRunning(kind);
    startTransition(async () => {
      if (kind === "records") {
        const result = await exportRecords();
        setFailed(!result.success);
        if (result.success) {
          download(
            toRecordsCsv(result.data, lang, csvDict),
            `cinelier-records-${today()}.csv`,
            "text/csv;charset=utf-8",
          );
        }
      } else {
        const result = await exportArticles();
        setFailed(!result.success);
        if (result.success) {
          const files = articleFiles(result.data, {
            movie: dict.exportMovie,
            createdAt: dict.exportCreatedAt,
            updatedAt: dict.exportUpdatedAt,
            releaseYear: releaseYearTemplate,
          });
          download(
            zipSync(
              Object.fromEntries(
                files.map((file) => [file.name, strToU8(file.text)]),
              ),
            ),
            `cinelier-articles-${today()}.zip`,
            "application/zip",
          );
        }
      }
      setRunning(undefined);
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
      <div className="mt-2 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run("records")}
        >
          <Download className="size-4" aria-hidden />
          {running === "records" ? dict.exporting : dict.exportAction}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => run("articles")}
        >
          <Download className="size-4" aria-hidden />
          {running === "articles" ? dict.exporting : dict.exportArticlesAction}
        </Button>
      </div>
      {failed && (
        <p role="alert" className="text-destructive-foreground text-sm">
          {dict.exportFailed}
        </p>
      )}
    </section>
  );
}
