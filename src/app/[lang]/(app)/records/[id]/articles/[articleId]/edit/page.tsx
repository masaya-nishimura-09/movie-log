import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateArticleAction } from "@/actions/article/save-article";
import { getArticle } from "@/api/article/get-article";
import { ArticleForm } from "@/components/organisms/article-form";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { articleFrom } from "@/lib/article/article-from";
import { fromKey, withFrom } from "@/lib/url/back-href";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.articleForm.editTitle };
}

export default async function EditArticlePage({
  params,
  searchParams,
}: PageProps<"/[lang]/records/[id]/articles/[articleId]/edit">) {
  const { id, articleId } = await params;
  const [lang, dict, article, query] = await Promise.all([
    getLocale(),
    getDictionary(),
    getArticle(articleId),
    searchParams,
  ]);
  if (!article || article.record.recordId !== id) notFound();
  const from = articleFrom(query[fromKey], lang, id);
  const backHref = withFrom(
    `/${lang}/records/${id}/articles/${articleId}`,
    from,
  );

  return (
    <>
      <PageTopBar
        backHref={backHref}
        backLabel={dict.articleForm.back}
        title={dict.articleForm.editTitle}
      />
      <ArticleForm
        action={updateArticleAction.bind(null, lang, articleId, from)}
        backHref={backHref}
        values={{ title: article.title, content: article.content }}
        dict={dict.articleForm}
        editorDict={dict.articleEditor}
        counterTemplate={dict.characterCount}
      />
    </>
  );
}
