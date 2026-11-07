import { LocalDate } from "@/components/atoms/local-date";
import { ArticleNoteCard } from "@/components/molecules/article-note-card";
import type { Locale } from "@/i18n/locales";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
import type { ArticleSummary } from "@/schemas/article/article";

type ArticleListProps = {
  lang: Locale;
  articles: ArticleSummary[];
  dateField: "createdAt" | "updatedAt";
  noPosterLabel: string;
  yearTemplate: string;
  fromHref: string;
};

export function ArticleList({
  lang,
  articles,
  dateField,
  noPosterLabel,
  yearTemplate,
  fromHref,
}: ArticleListProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 pt-1.5 md:grid-cols-2 2xl:grid-cols-3">
      {articles.map((article) => {
        const { record } = article;
        const year =
          record.releaseYear > 0
            ? interpolate(yearTemplate, { year: record.releaseYear })
            : "";
        return (
          <li key={article.articleId} className="min-w-0">
            <ArticleNoteCard
              href={withFrom(
                `/${lang}/records/${record.recordId}/articles/${article.articleId}`,
                fromHref,
              )}
              title={article.title}
              date={
                <LocalDate
                  date={article[dateField]}
                  locale={lang}
                  dateStyle="medium"
                />
              }
              movie={{
                title:
                  year === "" ? record.title : `${record.title} ・ ${year}`,
                posterUrl: record.posterUrl,
                noPosterLabel,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
