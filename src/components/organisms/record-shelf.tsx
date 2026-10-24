import { TextLink } from "@/components/atoms/text-link";
import { ShelfScroller } from "@/components/molecules/shelf-scroller";
import { RecordItemCard } from "@/components/organisms/record-item-card";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

type RecordShelfProps = {
  lang: Locale;
  title: string;
  records: MovieRecord[];
  more?: { href: string; label: string };
  dict: Pick<Dictionary, "enums" | "recordCard" | "home">;
  headingLevel?: "h2" | "h3";
  fromHref?: string;
};

export function RecordShelf({
  lang,
  title,
  records,
  more,
  dict,
  headingLevel: Heading = "h2",
  fromHref,
}: RecordShelfProps) {
  return (
    <ShelfScroller
      heading={
        <Heading className="font-bold text-foreground text-lg">{title}</Heading>
      }
      more={
        more && (
          <TextLink href={more.href} className="text-sm">
            {more.label}
          </TextLink>
        )
      }
      prevLabel={interpolate(dict.home.shelfPrev, { title })}
      nextLabel={interpolate(dict.home.shelfNext, { title })}
    >
      {records.map((record) => (
        <li
          key={record.recordId}
          className="flex w-36 shrink-0 snap-start md:w-44"
        >
          <RecordItemCard
            lang={lang}
            record={record}
            dict={dict}
            fromHref={fromHref}
          />
        </li>
      ))}
    </ShelfScroller>
  );
}
