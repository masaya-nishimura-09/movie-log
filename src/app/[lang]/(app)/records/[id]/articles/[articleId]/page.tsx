import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteArticleAction } from "@/actions/article/delete-article";
import { getArticle } from "@/api/article/get-article";
import { buttonVariants } from "@/components/atoms/button";
import { ArticleDetail } from "@/components/organisms/article-detail";
import { DeleteDialog } from "@/components/organisms/delete-dialog";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { articleFrom, isFromArticleList } from "@/lib/article/article-from";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { fromKey, withFrom } from "@/lib/url/back-href";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/records/[id]/articles/[articleId]">): Promise<Metadata> {
  const { articleId } = await params;
  const article = await getArticle(articleId);
  return { title: article?.title };
}

export default async function ArticlePage({
  params,
  searchParams,
}: PageProps<"/[lang]/records/[id]/articles/[articleId]">) {
  const { id, articleId } = await params;
  const [lang, dict, article, query] = await Promise.all([
    getLocale(),
    getDictionary(),
    getArticle(articleId),
    searchParams,
  ]);
  if (!article || article.record.recordId !== id) notFound();
  const { record } = article;
  const from = articleFrom(query[fromKey], lang, id);

  return (
    <>
      <PageTopBar
        backHref={from ?? `/${lang}/records/${id}`}
        backLabel={
          from && isFromArticleList(from, lang)
            ? dict.articleDetail.backToList
            : record.title
        }
        actions={
          <>
            <Link
              href={withFrom(
                `/${lang}/records/${id}/articles/${articleId}/edit`,
                from,
              )}
              aria-label={dict.articleDetail.edit}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "px-2.5 md:px-3.5",
              )}
            >
              <Pencil className="size-4.5" aria-hidden />
              <span className="hidden md:inline">
                {dict.articleDetail.edit}
              </span>
            </Link>
            <DeleteDialog
              action={deleteArticleAction.bind(null, lang, id, articleId, from)}
              description={interpolate(dict.deleteArticle.description, {
                title: article.title,
              })}
              triggerLabel={dict.articleDetail.delete}
              dict={dict.deleteArticle}
            />
          </>
        }
      />
      <ArticleDetail
        lang={lang}
        article={article}
        recordCard={{
          href: `/${lang}/records/${id}`,
          title: record.title,
          posterUrl: record.posterUrl,
          noPosterLabel: dict.recordCard.noPoster,
          year:
            record.releaseYear > 0
              ? interpolate(dict.recordDetail.releaseYear, {
                  year: record.releaseYear,
                })
              : "",
        }}
        dict={dict.articleDetail}
      />
    </>
  );
}
