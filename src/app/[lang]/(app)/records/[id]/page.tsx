import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRecordAction } from "@/actions/record/delete-record";
import { getRecord } from "@/api/record/get-record";
import { buttonVariants } from "@/components/atoms/button";
import { DeleteRecordDialog } from "@/components/organisms/delete-record-dialog";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { RecordDetail } from "@/components/organisms/record-detail";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/records/[id]">): Promise<Metadata> {
  const { id } = await params;
  const record = await getRecord(id);
  return { title: record?.title };
}

export default async function RecordPage({
  params,
}: PageProps<"/[lang]/records/[id]">) {
  const { id } = await params;
  const [lang, dict, record] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
  ]);
  if (!record) notFound();

  return (
    <>
      <PageTopBar
        backHref={`/${lang}/records`}
        backLabel={dict.recordDetail.back}
        actions={
          <>
            <Link
              href={`/${lang}/records/${id}/edit`}
              aria-label={dict.recordDetail.edit}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-transparent bg-transparent px-2 md:border-input md:bg-card md:px-3.5",
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
      <RecordDetail lang={lang} record={record} dict={dict} />
    </>
  );
}
