import { Temporal } from "@js-temporal/polyfill";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/api/article/get-all-articles";
import { getArticle } from "@/api/article/get-article";
import { getAllRecords } from "@/api/record/get-all-records";
import { buttonVariants } from "@/components/atoms/button";
import { LocalDate } from "@/components/atoms/local-date";
import { TextLink } from "@/components/atoms/text-link";
import { EmptyState } from "@/components/molecules/empty-state";
import {
  HomeReminder,
  type ReminderExcerpt,
} from "@/components/organisms/home-reminder";
import { RecordShelf } from "@/components/organisms/record-shelf";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { firstParagraphText } from "@/lib/article/headings";
import { pickMoodShelves, pickRecent, pickReminder } from "@/lib/home/shelves";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { firstSentence } from "@/lib/text/excerpt";
import { interpolate } from "@/lib/text/interpolate";
import { withFrom } from "@/lib/url/back-href";
import { buildHref } from "@/lib/url/build-href";
import type { ArticleSummary } from "@/schemas/article/article";
import { moodTagSchema } from "@/schemas/record/enums";
import type { MovieRecord } from "@/schemas/record/record";

const recentArticleCount = 4;

async function reminderExcerpt(
  record: MovieRecord,
  articles: ArticleSummary[],
  dict: Dictionary["home"],
): Promise<ReminderExcerpt | undefined> {
  if (record.memo.trim() !== "") {
    return { text: firstSentence(record.memo), source: dict.fromMemo };
  }
  const summary = articles.find(
    (article) => article.record.recordId === record.recordId,
  );
  const article = summary && (await getArticle(summary.articleId));
  const text = article && firstSentence(firstParagraphText(article.content));
  return article && text
    ? {
        text,
        source: interpolate(dict.fromArticle, { title: article.title }),
      }
    : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.home.heading };
}

export default async function HomePage() {
  const [lang, dict, records, articles] = await Promise.all([
    getLocale(),
    getDictionary(),
    getAllRecords("watched_at", "desc"),
    getAllArticles(),
  ]);
  const d = dict.home;
  const reminder = pickReminder(records, Temporal.Now.plainDateISO());
  const reminderItems = await Promise.all(
    reminder.map(async (record) => ({
      record,
      excerpt: await reminderExcerpt(record, articles, d),
    })),
  );
  const moodLinks = moodTagSchema.options
    .map((moodTag) => ({
      moodTag,
      count: records.filter((record) => record.moodTags.includes(moodTag))
        .length,
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .map(({ moodTag }) => ({
      label: dict.enums.moodTag[moodTag],
      href: buildHref(`/${lang}/records`, {
        [recordQueryKeys.moodTag]: moodTag,
      }),
    }));
  const moodShelves = pickMoodShelves(records);
  const recentArticles = articles.slice(0, recentArticleCount);
  const homePath = `/${lang}/home`;

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 pt-5 pb-7 md:px-7 md:pt-6">
      <h1 className="font-bold text-2xl text-foreground">{d.heading}</h1>

      {records.length === 0 ? (
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
          {reminderItems.length > 0 && (
            <HomeReminder
              lang={lang}
              items={reminderItems}
              moodLinks={moodLinks}
              dict={d}
              noPosterLabel={dict.recordCard.noPoster}
            />
          )}

          <RecordShelf
            lang={lang}
            title={d.recent}
            records={pickRecent(records)}
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
