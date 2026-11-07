import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/api/article/get-all-articles";
import { getMoodCounts } from "@/api/record/get-mood-counts";
import { getRecords } from "@/api/record/get-records";
import { buttonVariants } from "@/components/atoms/button";
import { LocalDate } from "@/components/atoms/local-date";
import { TextLink } from "@/components/atoms/text-link";
import { EmptyState } from "@/components/molecules/empty-state";
import { RecordShelf } from "@/components/organisms/record-shelf";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { pickShelfMoods } from "@/lib/home/shelves";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { withFrom } from "@/lib/url/back-href";
import { buildHref } from "@/lib/url/build-href";
import type { MoodTag } from "@/schemas/record/enums";
import type { RecordQuery } from "@/schemas/record/list";

const recentArticleCount = 4;

const latestRecordsQuery: RecordQuery = {
  score: undefined,
  platform: undefined,
  moodTags: [],
  genres: [],
  keyword: "",
  sort: "watchedAtDesc",
  page: 1,
};

async function getMoodShelf(moodTag: MoodTag) {
  const { records } = await getRecords({
    ...latestRecordsQuery,
    moodTags: [moodTag],
  });
  return { moodTag, records };
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.home.heading };
}

export default async function HomePage() {
  const [lang, dict, recent, moodShelves, articles] = await Promise.all([
    getLocale(),
    getDictionary(),
    getRecords(latestRecordsQuery),
    getMoodCounts().then((counts) =>
      Promise.all(pickShelfMoods(counts).map(getMoodShelf)),
    ),
    getAllArticles(),
  ]);
  const d = dict.home;
  const recentArticles = articles.slice(0, recentArticleCount);
  const homePath = `/${lang}/home`;

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 pt-5 pb-7 md:px-7 md:pt-6">
      <h1 className="font-bold text-2xl text-foreground">{d.heading}</h1>

      {recent.totalCount === 0 ? (
        <div className="flex flex-1 items-start justify-center py-10">
          <EmptyState
            title={d.emptyTitle}
            description={d.emptyDescription}
            action={
              <Link href={`/${lang}/records/new`} className={buttonVariants()}>
                {dict.nav.newRecord}
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <RecordShelf
            lang={lang}
            title={d.recent}
            records={recent.records}
            more={{ href: `/${lang}/records`, label: d.seeAll }}
            dict={dict}
            fromHref={homePath}
          />

          {recentArticles.length > 0 && (
            <section className="flex flex-col gap-3">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-bold text-foreground text-lg">
                  {d.recentArticles}
                </h2>
                <TextLink href={`/${lang}/articles`} className="text-sm">
                  {d.seeAll}
                </TextLink>
              </div>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {recentArticles.map((article) => (
                  <li key={article.articleId} className="min-w-0">
                    <Link
                      href={withFrom(
                        `/${lang}/records/${article.record.recordId}/articles/${article.articleId}`,
                        homePath,
                      )}
                      className="flex flex-col gap-1 rounded-2xl bg-card px-5 py-4 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="truncate font-medium text-[15px] text-foreground">
                        {article.title}
                      </span>
                      <span className="flex items-center gap-2 text-muted-foreground text-xs">
                        <span className="truncate">{article.record.title}</span>
                        <span aria-hidden>・</span>
                        <span className="shrink-0 tabular-nums">
                          <LocalDate
                            date={article.updatedAt}
                            locale={lang}
                            dateStyle="medium"
                          />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {moodShelves.length > 0 && (
            <section className="flex flex-col gap-5">
              <h2 className="font-bold text-foreground text-lg">{d.moods}</h2>
              {moodShelves.map((shelf) => (
                <RecordShelf
                  key={shelf.moodTag}
                  lang={lang}
                  title={dict.enums.moodTag[shelf.moodTag]}
                  headingLevel="h3"
                  records={shelf.records}
                  more={{
                    href: buildHref(`/${lang}/records`, {
                      [recordQueryKeys.moodTag]: shelf.moodTag,
                    }),
                    label: d.seeAll,
                  }}
                  dict={dict}
                  fromHref={homePath}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
