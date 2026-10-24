import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRecordAction } from "@/actions/record/delete-record";
import { getRecordArticles } from "@/api/article/get-record-articles";
import { getRecord } from "@/api/record/get-record";
import { buttonVariants } from "@/components/atoms/button";
import { DeleteRecordDialog } from "@/components/organisms/delete-record-dialog";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordDetail } from "@/components/organisms/record-detail";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { fromKey, pathOf, safeFromHref, withFrom } from "@/lib/url/back-href";

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
  const [lang, dict, record, recordArticles, query] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    getRecordArticles(id),
    searchParams,
  ]);
  if (!record) notFound();
  const homePath = `/${lang}/home`;
  const from = safeFromHref(query[fromKey], [`/${lang}/records`, homePath]);
  const backHref = from ?? `/${lang}/records`;

  return (
    <>
      <PageTopBar
        backHref={backHref}
        backLabel={
          from && pathOf(from) === homePath
            ? dict.recordDetail.backToHome
            : dict.recordDetail.back
        }
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
        articles={recordArticles.articles}
        articleTotal={recordArticles.total}
        articleFromHref={
          from === undefined
            ? undefined
            : withFrom(`/${lang}/records/${id}`, from)
        }
        dict={dict}
      />
    </>
  );
}
