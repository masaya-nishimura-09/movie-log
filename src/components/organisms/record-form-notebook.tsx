"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/atoms/button";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordPageCount, spreadOf } from "@/lib/record/field-page";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type RecordFormNotebookProps = {
  mode: "create" | "edit";
  page: number;
  onBack: () => void;
  onNext: () => void;
  panels: [ReactNode, ReactNode, ReactNode, ReactNode];
  missingCount: number;
  alert?: string;
  backHref: string;
  backLabel: string;
  cancelHref: string;
  saving: boolean;
  dict: Dictionary["recordForm"];
};

const spreadCount = recordPageCount / 2;

export function RecordFormNotebook({
  mode,
  page,
  onBack,
  onNext,
  panels,
  missingCount,
  alert,
  backHref,
  backLabel,
  cancelHref,
  saving,
  dict,
}: RecordFormNotebookProps) {
  const spread = spreadOf(page);
  const lastSpread = spread === spreadCount - 1;
  const lastPage = page === recordPageCount - 1;
  const spreadNames = [dict.spreadBasics, dict.spreadNote];
  const pageNames = [
    dict.pageBasics,
    dict.pageMovie,
    dict.pageNote,
    dict.pageScrap,
  ];
  const saveLabel = mode === "edit" ? dict.saveChanges : dict.save;
  const message =
    alert ??
    (missingCount > 0
      ? interpolate(dict.missingCount, { count: missingCount })
      : undefined);

  const saveButton = (className?: string) => (
    <Button
      type="submit"
      pending={saving}
      pendingLabel={dict.saving}
      className={className}
    >
      <Check aria-hidden />
      {saveLabel}
    </Button>
  );

  const wideActions = (
    <div className="hidden items-center gap-3 lg:flex">
      {message && (
        <p
          role="alert"
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[rgb(162_67_47/0.12)] px-3 font-semibold text-destructive-foreground text-xs"
        >
          <CircleAlert className="size-3.5" aria-hidden />
          {message}
        </p>
      )}
      {spread === 0 ? (
        <Link
          href={cancelHref}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          {dict.cancel}
        </Link>
      ) : (
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft aria-hidden />
          {dict.back}
        </Button>
      )}
      {!lastSpread && (
        <Button
          type="button"
          variant={mode === "edit" ? "outline" : "default"}
          size="sm"
          onClick={onNext}
          className="px-4"
        >
          {mode === "edit" ? dict.toNote : dict.next}
          <ArrowRight aria-hidden />
        </Button>
      )}
      {(lastSpread || mode === "edit") && saveButton("h-10 px-4")}
    </div>
  );

  const narrowHeader = (
    <div className="flex w-full items-center gap-2 lg:hidden">
      <Link
        href={cancelHref}
        className="inline-flex min-h-10 w-16.5 items-center text-[13px] text-foreground"
      >
        {dict.cancel}
      </Link>
      <div className="flex flex-1 flex-col items-center gap-1">
        <span aria-hidden className="flex gap-1">
          {pageNames.map((name, index) => (
            <span
              key={name}
              className={cn(
                "h-1.5 rounded-full",
                index === page ? "w-4" : "w-1.5",
                index <= page ? "bg-primary" : "bg-[rgb(10_41_71/0.15)]",
              )}
            />
          ))}
        </span>
        <span aria-live="polite" className="text-foreground-sub text-xs">
          {interpolate(dict.stepProgress, {
            current: page + 1,
            total: recordPageCount,
          })}
          {` ・ ${pageNames[page]}`}
        </span>
      </div>
      <span aria-hidden className="w-16.5" />
    </div>
  );

  const narrowFooter = (
    <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 bg-background px-4 pt-2.5 pb-4.5 md:-mx-8 md:px-8 lg:hidden">
      {message && (
        <p
          role="alert"
          className="inline-flex items-center gap-1.5 self-center rounded-full bg-[rgb(162_67_47/0.12)] px-3 py-1 font-semibold text-destructive-foreground text-xs"
        >
          <CircleAlert className="size-3.5" aria-hidden />
          {message}
        </p>
      )}
      <div className="flex gap-2.5">
        {page > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            <ChevronLeft aria-hidden />
            {dict.back}
          </Button>
        )}
        {lastPage ? (
          <Fragment key="save">{saveButton("flex-1 text-[15px]")}</Fragment>
        ) : (
          <Button
            key="next"
            type="button"
            onClick={onNext}
            className="flex-1 text-[15px]"
          >
            {dict.next}
            <ChevronRight aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );

  const pageClass = (index: number) =>
    cn(
      "lg:h-auto lg:min-h-175",
      index !== page && "max-lg:hidden",
      spreadOf(index) !== spread && "lg:hidden",
    );

  return (
    <NotebookScreen
      grow
      toolbar={
        <>
          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href={backHref}
              className="-ml-1 inline-flex min-h-11 items-center gap-2 rounded-sm px-1 text-foreground text-sm outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="size-4.5" aria-hidden />
              {backLabel}
            </Link>
            <span className="flex items-center gap-2.5 text-[13px] text-foreground-sub">
              <span aria-hidden className="flex gap-1">
                {spreadNames.map((name, index) => (
                  <span
                    key={name}
                    className={cn(
                      "h-0.75 w-5.5 rounded-full",
                      index <= spread ? "bg-primary" : "bg-(--sage)",
                    )}
                  />
                ))}
              </span>
              <span aria-live="polite">
                {interpolate(dict.stepProgress, {
                  current: spread + 1,
                  total: spreadCount,
                })}
                {` ・ ${spreadNames[spread]}`}
                {mode === "edit" && dict.editing}
              </span>
            </span>
          </div>
          {narrowHeader}
          <div className="hidden flex-1 lg:block" />
          {wideActions}
        </>
      }
      footer={narrowFooter}
    >
      <RingNotebook variant="responsive">
        {panels.map((panel, index) => (
          <NotebookPage
            // biome-ignore lint/suspicious/noArrayIndexKey: the four pages are fixed
            key={index}
            side={index % 2 === 0 ? "auto-left" : "auto-right"}
            label={pageNames[index]}
            footer={<span className="tabular-nums">{index + 1}</span>}
            className={pageClass(index)}
          >
            {panel}
          </NotebookPage>
        ))}
      </RingNotebook>
    </NotebookScreen>
  );
}
