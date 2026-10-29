import Link from "next/link";
import { LocalDate } from "@/components/atoms/local-date";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { interpolateNode } from "@/lib/text/interpolate-node";
import { withFrom } from "@/lib/url/back-href";
import type { MovieRecord } from "@/schemas/record/record";

export type ReminderExcerpt = {
  text: string;
  source: string;
};

type HomeReminderProps = {
  lang: Locale;
  items: {
    record: MovieRecord;
    excerpt: ReminderExcerpt | undefined;
  }[];
  dict: Dictionary["home"];
  noPosterLabel: string;
};

export function HomeReminder({
  lang,
  items,
  dict,
  noPosterLabel,
}: HomeReminderProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-bold text-foreground text-lg">
        {dict.reminderHeading}
      </h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {items.map(({ record, excerpt }) => (
          <li key={record.recordId} className="flex">
            <Link
              href={withFrom(
                `/${lang}/records/${record.recordId}`,
                `/${lang}/home`,
              )}
              className="flex w-full gap-4 rounded-[18px] bg-card p-4 outline-none transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring md:gap-6 md:p-5"
            >
              <RecordPoster
                posterUrl={record.posterUrl}
                noPosterLabel={noPosterLabel}
                sizes="144px"
                className="w-24 shrink-0 rounded-lg shadow-[0_2px_8px_rgb(0_0_0/0.2)] md:w-36"
              />
              <span className="flex min-w-0 flex-col gap-3 py-1">
                <span className="flex flex-col gap-1">
                  <span className="font-bold text-foreground text-lg leading-snug">
                    {record.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {interpolateNode(dict.watchedOn, {
                      date: (
                        <LocalDate
                          date={record.watchedAt}
                          locale={lang}
                          dateStyle="longDate"
                        />
                      ),
                    })}
                  </span>
                </span>
                {excerpt && (
                  <span className="flex flex-col gap-1.5 border-input border-l-2 pl-3.5">
                    <span className="text-[15px] text-foreground leading-relaxed">
                      {excerpt.text}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {excerpt.source}
                    </span>
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
