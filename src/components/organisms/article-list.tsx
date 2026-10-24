import Link from "next/link";
import { LocalDate } from "@/components/atoms/local-date";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
import type { ArticleSummary } from "@/schemas/article/article";

type ArticleListProps = {
  lang: Locale;
  articles: ArticleSummary[];
  startIndex: number;
  dict: Dictionary["articleList"];
  noPosterLabel: string;
  yearTemplate: string;
  fromHref: string;
};

const columns =
  "md:grid-cols-[2.5rem_minmax(0,3fr)_minmax(0,2.5fr)_6.5rem_6.5rem]";

export function ArticleList({
  lang,
  articles,
  startIndex,
  dict,
  noPosterLabel,
  yearTemplate,
  fromHref,
}: ArticleListProps) {
  return (
    <div className="flex flex-col">
      <div
        aria-hidden
        className={cn(
          "sticky top-0 z-10 hidden gap-x-4 border-border border-b bg-background px-3 py-2 font-medium text-muted-foreground text-xs md:grid",
          columns,
        )}
      >
        <span className="text-center">{dict.columnIndex}</span>
        <span>{dict.columnTitle}</span>
        <span>{dict.columnRecord}</span>
        <span>{dict.columnCreatedAt}</span>
        <span>{dict.columnUpdatedAt}</span>
      </div>
      <ul className="flex flex-col gap-0.5 pt-1.5">
        {articles.map((article, index) => {
          const { record } = article;
          const year =
            record.releaseYear > 0
              ? interpolate(yearTemplate, { year: record.releaseYear })
              : "";
          return (
            <li key={article.articleId}>
              <Link
                href={withFrom(
                  `/${lang}/records/${record.recordId}/articles/${article.articleId}`,
                  fromHref,
                )}
                className={cn(
                  "group grid items-center gap-x-4 rounded-lg px-3 py-2.5 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring",
                  columns,
                )}
              >
                <span className="hidden text-center text-muted-foreground text-sm tabular-nums group-hover:text-foreground md:block">
                  {startIndex + index + 1}
                </span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-bold text-[15px] text-foreground leading-snug">
                      {article.title}
                    </span>
                    <span className="shrink-0 text-muted-foreground text-xs tabular-nums md:hidden">
                      <LocalDate
                        date={article.updatedAt}
                        locale={lang}
                        dateStyle="medium"
                      />
                    </span>
                  </span>
                  <span className="flex min-w-0 items-center gap-2 md:hidden">
                    <RecordPoster
                      posterUrl={record.posterUrl}
                      noPosterLabel={noPosterLabel}
                      sizes="20px"
                      className="w-5 shrink-0 rounded-[3px] ring-1 ring-foreground/10"
                    />
                    <span className="truncate text-foreground-sub text-xs">
                      {record.title}
                      {year !== "" && (
                        <span className="text-muted-foreground">
                          {" "}
                          ・ {year}
                        </span>
                      )}
                    </span>
                  </span>
                </span>
                <span className="hidden min-w-0 items-center gap-3 md:flex">
                  <RecordPoster
                    posterUrl={record.posterUrl}
                    noPosterLabel={noPosterLabel}
                    sizes="40px"
                    className="w-10 shrink-0 rounded-[5px] shadow-[0_1px_4px_rgb(0_0_0/0.2)] ring-1 ring-foreground/10"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-foreground-sub text-sm">
                      {record.title}
                    </span>
                    {year !== "" && (
                      <span className="text-muted-foreground text-xs">
                        {year}
                      </span>
                    )}
                  </span>
                </span>
                <span className="hidden text-muted-foreground text-sm tabular-nums md:block">
                  <LocalDate
                    date={article.createdAt}
                    locale={lang}
                    dateStyle="medium"
                  />
                </span>
                <span className="hidden text-muted-foreground text-sm tabular-nums md:block">
                  <LocalDate
                    date={article.updatedAt}
                    locale={lang}
                    dateStyle="medium"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
