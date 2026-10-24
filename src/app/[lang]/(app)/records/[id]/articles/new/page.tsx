import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createArticleAction } from "@/actions/article/save-article";
import { getRecord } from "@/api/record/get-record";
import { ArticleForm } from "@/components/organisms/article-form";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { articleFrom } from "@/lib/article/article-from";
import { fromKey } from "@/lib/url/back-href";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.articleForm.createTitle };
}

export default async function NewArticlePage({
  params,
  searchParams,
}: PageProps<"/[lang]/records/[id]/articles/new">) {
  const { id } = await params;
  const [lang, dict, record, query] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecord(id),
    searchParams,
  ]);
  if (!record) notFound();
  const from = articleFrom(query[fromKey], lang, id);
  const backHref = from ?? `/${lang}/records/${id}`;

  return (
    <>
      <PageTopBar
        backHref={backHref}
        backLabel={dict.articleForm.back}
        title={dict.articleForm.createTitle}
      />
      <ArticleForm
        action={createArticleAction.bind(null, lang, id, from)}
        backHref={backHref}
        values={{ title: "" }}
        dict={dict.articleForm}
        editorDict={dict.articleEditor}
        counterTemplate={dict.characterCount}
      />
    </>
  );
}
