import { LocalDate } from "@/components/atoms/local-date";
import { ArticleBody } from "@/components/molecules/article-body";
import {
  ArticleRecordCard,
  type ArticleRecordCardProps,
} from "@/components/molecules/article-record-card";
import { ArticleToc } from "@/components/organisms/article-toc";
import { ArticleTocBar } from "@/components/organisms/article-toc-bar";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { extractHeadings } from "@/lib/article/headings";
import type { Article } from "@/schemas/article/article";

type ArticleDetailProps = {
  lang: Locale;
  article: Article;
  recordCard: Omit<ArticleRecordCardProps, "className">;
  dict: Dictionary["articleDetail"];
};

export function ArticleDetail({
  lang,
  article,
  recordCard,
  dict,
}: ArticleDetailProps) {
  const headings = extractHeadings(article.content).map(
    ({ id, level, text }) => ({ id, level, text }),
  );

  const hasToc = headings.length > 0;

  return (
    <div>
      {hasToc && (
        <ArticleTocBar
          items={headings}
          label={dict.toc}
          topLabel={dict.tocTop}
        />
      )}
      <div className="mx-auto w-full max-w-5xl px-4 pt-5 pb-10 md:px-10 md:pt-8">
        <div className="flex items-start justify-center gap-8">
          <aside className="sticky top-24 hidden w-52 shrink-0 flex-col gap-6 xl:flex">
            <ArticleRecordCard {...recordCard} />
            {hasToc && <ArticleToc items={headings} label={dict.toc} />}
          </aside>
          <article className="flex w-full min-w-0 max-w-[43rem] flex-col gap-6">
            <ArticleRecordCard {...recordCard} className="xl:hidden" />
            <header className="flex flex-col gap-2.5">
              <h1 className="break-words font-bold text-2xl text-foreground leading-[1.35] md:text-[29px]">
                {article.title}
              </h1>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
                <span>
                  {dict.createdAt}{" "}
                  <LocalDate
                    date={article.createdAt}
                    locale={lang}
                    dateStyle="dateTime"
                  />
                </span>
                <span>
                  {dict.updatedAt}{" "}
                  <LocalDate
                    date={article.updatedAt}
                    locale={lang}
                    dateStyle="dateTime"
                  />
                </span>
              </p>
            </header>
            <ArticleBody
              content={article.content}
              className="rounded-2xl bg-card px-6 py-6 md:px-8 md:py-8"
            />
          </article>
        </div>
      </div>
    </div>
  );
}
