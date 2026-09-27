import type { ReactNode } from "react";
import { FilterCheckLink } from "@/components/molecules/filter-check-link";
import { FilterChipLink } from "@/components/molecules/filter-chip-link";
import { SortSelect } from "@/components/molecules/sort-select";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { buildHref, type QueryValues, toggleValue } from "@/lib/url/build-href";
import {
  genreSchema,
  moodTagSchema,
  platformSchema,
  scores,
} from "@/schemas/record/enums";
import {
  type RecordList,
  type RecordQuery,
  recordSorts,
} from "@/schemas/record/list";

type RecordFilterPanelProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
  facets: RecordList["facets"];
  dict: Dictionary["recordFilter"];
  sortDict: Dictionary["recordSort"];
  enums: Dictionary["enums"];
};

const visiblePlatformCount = 6;

function Section({
  title,
  dashed,
  children,
}: {
  title: string;
  dashed?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-2.25",
        dashed && "border-t border-dashed pt-1",
      )}
    >
      <h2 className="font-bold font-sans text-muted-foreground text-xs tracking-[0.08em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function RecordFilterPanel({
  basePath,
  query,
  values,
  facets,
  dict,
  sortDict,
  enums,
}: RecordFilterPanelProps) {
  const toggleHref = (key: string, value: string) =>
    buildHref(basePath, toggleValue(values, key, value));

  const platforms = platformSchema.options.toSorted(
    (a, b) =>
      Number(query.platforms.includes(b)) -
        Number(query.platforms.includes(a)) ||
      (facets.platforms[b] ?? 0) - (facets.platforms[a] ?? 0),
  );
  const moodTags = moodTagSchema.options.filter(
    (m) => query.moodTags.includes(m) || (facets.moodTags[m] ?? 0) > 0,
  );
  const genres = genreSchema.options.filter(
    (g) => query.genres.includes(g) || (facets.genres[g] ?? 0) > 0,
  );

  const platformLink = (platform: (typeof platforms)[number]) => (
    <FilterCheckLink
      key={platform}
      href={toggleHref(recordQueryKeys.platform, platform)}
      active={query.platforms.includes(platform)}
      label={enums.platform[platform]}
      count={facets.platforms[platform] ?? 0}
    />
  );

  return (
    <div className="flex flex-col gap-5.5">
      <Section title={sortDict.label}>
        <SortSelect
          label={sortDict.label}
          value={query.sort}
          options={recordSorts.map((sort) => ({
            value: sort,
            label: sortDict[sort],
            href: buildHref(basePath, {
              ...values,
              [recordQueryKeys.sort]:
                sort === "watchedAtDesc" ? undefined : sort,
              [recordQueryKeys.page]: undefined,
            }),
          }))}
        />
      </Section>

      <Section title={dict.score}>
        <div className="flex gap-1.5">
          {scores.toReversed().map((score) => (
            <FilterChipLink
              key={score}
              shape="block"
              size="sm"
              href={toggleHref(recordQueryKeys.score, String(score))}
              active={query.scores.includes(score)}
              className="h-9 rounded-[10px] text-[13px] text-foreground-sub"
            >
              {score}
            </FilterChipLink>
          ))}
        </div>
      </Section>

      <Section title={dict.platform}>
        <div className="flex flex-col gap-2">
          {platforms.slice(0, visiblePlatformCount).map(platformLink)}
          <details className="group flex flex-col">
            <summary className="mt-0.5 cursor-pointer list-none text-primary text-xs group-open:hidden">
              {interpolate(dict.showAllPlatforms, {
                count: platformSchema.options.length,
              })}
            </summary>
            <div className="flex flex-col gap-2">
              {platforms.slice(visiblePlatformCount).map(platformLink)}
            </div>
          </details>
        </div>
      </Section>

      {moodTags.length > 0 && (
        <Section title={dict.moodTag}>
          <div className="flex flex-wrap gap-1.5">
            {moodTags.map((mood) => (
              <FilterChipLink
                key={mood}
                size="sm"
                href={toggleHref(recordQueryKeys.moodTag, mood)}
                active={query.moodTags.includes(mood)}
              >
                {enums.moodTag[mood]}
              </FilterChipLink>
            ))}
          </div>
        </Section>
      )}

      {genres.length > 0 && (
        <Section title={dict.genre} dashed>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <FilterChipLink
                key={genre}
                shape="square"
                size="sm"
                tone="genre"
                href={toggleHref(recordQueryKeys.genre, genre)}
                active={query.genres.includes(genre)}
              >
                {enums.genre[genre]}
              </FilterChipLink>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
