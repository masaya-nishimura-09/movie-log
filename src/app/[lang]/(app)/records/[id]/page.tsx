import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addAttachmentAction,
  deleteAttachmentAction,
} from "@/actions/record/attachment";
import { deleteRecordAction } from "@/actions/record/delete-record";
import { getRecord } from "@/api/record/get-record";
import { getRecordAttachments } from "@/api/record/get-record-attachments";
import { buttonVariants } from "@/components/atoms/button";
import { DeleteRecordDialog } from "@/components/organisms/delete-record-dialog";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordDetail } from "@/components/organisms/record-detail";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { fromKey, safeFromHref } from "@/lib/url/back-href";

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
  const from = safeFromHref(query[fromKey], [`/${lang}/records`]);
  const backHref = from ?? `/${lang}/records`;

  return (
    <>
      <PageTopBar
        backHref={backHref}
        backLabel={dict.recordDetail.back}
        actions={
          <>
            <Link
              href={`/${lang}/records/${id}/edit`}
              aria-label={dict.recordDetail.edit}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "px-2.5 md:px-3.5",
              )}
            >
              <Pencil className="size-4.5" aria-hidden />
              <span className="hidden md:inline">{dict.recordDetail.edit}</span>
            </Link>
            <DeleteRecordDialog
              action={deleteRecordAction.bind(null, lang, id)}
              title={record.title}
              watchedAt={record.watchedAt}
              lang={lang}
              triggerLabel={dict.recordDetail.delete}
              dict={dict.deleteRecord}
            />
          </>
        }
      />
      <RecordDetail
        lang={lang}
        record={record}
        attachments={attachments}
        addAttachment={addAttachmentAction.bind(null, id)}
        deleteAttachment={deleteAttachmentAction.bind(null, id)}
        dict={dict}
      />
    </>
  );
}
