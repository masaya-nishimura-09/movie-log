import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { LocalDate } from "@/components/atoms/local-date";
import { SectionLabel } from "@/components/atoms/section-label";
import { TextLink } from "@/components/atoms/text-link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { articleQueryKeys } from "@/lib/article/parse-article-query";
import { cn } from "@/lib/style/cn";
import { withFrom } from "@/lib/url/back-href";
import { buildHref } from "@/lib/url/build-href";
import type { ArticleSummary } from "@/schemas/article/article";

type RecordArticleSectionProps = {
  lang: Locale;
  recordId: string;
  articles: ArticleSummary[];
  total: number;
  fromHref?: string;
  dict: Dictionary["recordDetail"];
};

export function RecordArticleSection({
  lang,
  recordId,
  articles,
  total,
  fromHref,
  dict,
}: RecordArticleSectionProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>{dict.articles}</SectionLabel>
        {articles.length > 0 && (
          <TextLink
            href={withFrom(
              `/${lang}/records/${recordId}/articles/new`,
              fromHref,
            )}
            className="text-sm"
          >
            {dict.articlesAdd}
          </TextLink>
        )}
      </div>
      {articles.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {articles.map((article) => (
            <li key={article.articleId}>
              <Link
                href={withFrom(
                  `/${lang}/records/${recordId}/articles/${article.articleId}`,
                  fromHref,
                )}
                className="flex items-baseline justify-between gap-4 rounded-2xl bg-card px-5.5 py-4 text-[15px] text-foreground outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring 2xl:px-7 2xl:py-5 2xl:text-lg"
              >
                <span className="min-w-0 truncate font-medium">
                  {article.title}
                </span>
                <span className="shrink-0 text-muted-foreground text-xs tabular-nums 2xl:text-sm">
                  <LocalDate
                    date={article.updatedAt}
                    locale={lang}
                    dateStyle="medium"
                  />
                </span>
              </Link>
            </li>
          ))}
          {total > articles.length && (
            <li>
              <Link
                href={buildHref(`/${lang}/articles`, {
                  [articleQueryKeys.record]: recordId,
                })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-1",
                )}
              >
                {dict.articlesMore}
              </Link>
            </li>
          )}
        </ul>
      ) : (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-dashed px-5.5 py-5 text-[15px] text-muted-foreground 2xl:px-7 2xl:py-6 2xl:text-lg">
          {dict.articlesEmpty}
          <TextLink
            href={withFrom(
              `/${lang}/records/${recordId}/articles/new`,
              fromHref,
            )}
          >
            {dict.articlesAdd}
          </TextLink>
        </p>
      )}
    </section>
  );
}
