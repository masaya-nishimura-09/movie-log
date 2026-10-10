import { X } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref, type QueryValues, toggleValue } from "@/lib/url/build-href";
import type { RecordQuery } from "@/schemas/record/list";

type ActiveFilterListProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
  clearHref: string;
  dict: Dictionary["recordFilter"];
  enums: Dictionary["enums"];
};

export function ActiveFilterList({
  basePath,
  query,
  values,
  clearHref,
  dict,
  enums,
}: ActiveFilterListProps) {
  const items = [
    ...(query.keyword === ""
      ? []
      : [
          {
            label: `"${query.keyword}"`,
            href: buildHref(basePath, {
              ...values,
              [recordQueryKeys.keyword]: undefined,
              [recordQueryKeys.page]: undefined,
            }),
          },
        ]),
    ...query.scores.map((score) => ({
      label: `${dict.score} ${score}`,
      href: buildHref(
        basePath,
        toggleValue(values, recordQueryKeys.score, String(score)),
      ),
    })),
    ...query.platforms.map((platform) => ({
      label: enums.platform[platform],
      href: buildHref(
        basePath,
        toggleValue(values, recordQueryKeys.platform, platform),
      ),
    })),
    ...query.moodTags.map((mood) => ({
      label: enums.moodTag[mood],
      href: buildHref(
        basePath,
        toggleValue(values, recordQueryKeys.moodTag, mood),
      ),
    })),
    ...query.genres.map((genre) => ({
      label: enums.genre[genre],
      href: buildHref(
        basePath,
        toggleValue(values, recordQueryKeys.genre, genre),
      ),
    })),
  ];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          scroll={false}
          aria-label={interpolate(dict.remove, { label: item.label })}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-selected px-2.75 font-medium text-selected-foreground text-xs hover:brightness-97"
        >
          {item.label}
          <X className="size-3.75" aria-hidden />
        </Link>
      ))}
      <Link
        href={clearHref}
        scroll={false}
        className="px-1.5 font-medium text-muted-foreground text-xs underline-offset-4 hover:underline"
      >
        {dict.clearAll}
      </Link>
    </div>
  );
}
