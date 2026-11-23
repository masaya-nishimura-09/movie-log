import { ArrowLeft, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRecordAction } from "@/actions/record/delete-record";
import { getRecord } from "@/api/record/get-record";
import { getRecordAttachments } from "@/api/record/get-record-attachments";
import { buttonVariants } from "@/components/atoms/button";
import { LocalDate } from "@/components/atoms/local-date";
import { NoteNode } from "@/components/molecules/note-body";
import { DeleteRecordDialog } from "@/components/organisms/delete-record-dialog";
import {
  RecordCoverHeader,
  RecordMovieInfo,
  RecordOverview,
} from "@/components/organisms/record-cover";
import { RecordNotebook } from "@/components/organisms/record-notebook";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { hasText } from "@/lib/note/has-text";
import { noteHeadings } from "@/lib/note/note-headings";
import { movieInfoRows } from "@/lib/record/movie-info-rows";
import { cn } from "@/lib/style/cn";
import { fromKey, safeFromHref } from "@/lib/url/back-href";

const toolbarButton =
  "max-lg:h-9 max-lg:px-3 max-lg:text-[13px] max-lg:[&_svg]:size-3.75";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/records/[id]">): Promise<Metadata> {
  const { id } = await params;
  const record = await getRecord(id);
  return { title: record?.title };
}

export default async function RecordPage({
  params,
  searchParams,
}: PageProps<"/[lang]/records/[id]">) {
  const { id } = await params;
  const [lang, dict, record, attachments, query] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    getRecordAttachments(id),
    searchParams,
  ]);
  if (!record) notFound();
  const d = dict.recordDetail;
  const backHref =
    safeFromHref(query[fromKey], [`/${lang}/records`]) ?? `/${lang}/records`;
  const infoRows = movieInfoRows(lang, record, dict);
  const coverBlocks = [
    <RecordCoverHeader key="header" lang={lang} record={record} dict={dict} />,
    ...(infoRows.length > 0
      ? [<RecordMovieInfo key="info" label={d.movieInfo} rows={infoRows} />]
      : []),
    ...(record.overview !== ""
      ? [
          <RecordOverview
            key="overview"
            label={d.overview}
            overview={record.overview}
          />,
        ]
      : []),
  ];
  const noteBlocks =
    record.note && hasText(record.note)
      ? (record.note.content ?? []).map((node, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
          <NoteNode key={index} node={node} />
        ))
      : [];

  return (
    <RecordNotebook
      coverBlocks={coverBlocks}
      noteBlocks={noteBlocks}
      noteHeadings={
        noteBlocks.length > 0 ? noteHeadings(record.note?.content ?? []) : []
      }
      coverFooter={
        <span>
          {d.createdAt}{" "}
          <LocalDate
            date={record.createdAt}
            locale={lang}
            dateStyle="dateTime"
          />
        </span>
      }
      attachments={attachments}
      back={
        <Link
          href={backHref}
          className="-ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-sm px-1 text-foreground text-sm outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring lg:gap-2"
        >
          <ArrowLeft className="size-4.5" aria-hidden />
          {dict.common.toContents}
        </Link>
      }
      actions={
        <div className="flex items-center gap-1.5 lg:gap-3">
          <Link
            href={`/${lang}/records/${id}/edit`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              toolbarButton,
            )}
          >
            <Pencil aria-hidden />
            {d.edit}
          </Link>
          <DeleteRecordDialog
            action={deleteRecordAction.bind(null, lang, id)}
            title={record.title}
            watchedAt={record.watchedAt}
            lang={lang}
            triggerLabel={d.delete}
            triggerClassName={toolbarButton}
            dict={dict.deleteRecord}
          />
        </div>
      }
      dict={d}
      deleteDict={dict.deleteAttachment}
    />
  );
}
