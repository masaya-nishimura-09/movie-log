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
import { type RecordQuery, recordSorts } from "@/schemas/record/list";

type RecordFilterPanelProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
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
      <h2 className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

type FilterOptionsProps = Omit<RecordFilterPanelProps, "dict" | "sortDict">;

function toggleHrefFor(basePath: string, values: QueryValues) {
  return (key: string, value: string) =>
    buildHref(basePath, toggleValue(values, key, value));
}

export function SortOptions({
  basePath,
  query,
  values,
  sortDict,
  className,
}: Omit<FilterOptionsProps, "enums"> & {
  sortDict: Dictionary["recordSort"];
  className?: string;
}) {
  return (
    <SortSelect
      className={className}
      label={sortDict.label}
      value={query.sort}
      options={recordSorts.map((sort) => ({
        value: sort,
        label: sortDict[sort],
        href: buildHref(basePath, {
          ...values,
          [recordQueryKeys.sort]: sort === "watchedAtDesc" ? undefined : sort,
          [recordQueryKeys.page]: undefined,
        }),
      }))}
    />
  );
}

export function ScoreOptions({ basePath, query, values }: FilterOptionsProps) {
  const toggleHref = toggleHrefFor(basePath, values);
  return (
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
  );
}

export function PlatformOptions({
  basePath,
  query,
  values,
  enums,
  collapsed,
  showAllLabel,
}: FilterOptionsProps & { collapsed?: boolean; showAllLabel?: string }) {
  const toggleHref = toggleHrefFor(basePath, values);
  const platforms = platformSchema.options.toSorted(
    (a, b) =>
      Number(query.platforms.includes(b)) - Number(query.platforms.includes(a)),
  );
  const platformLink = (platform: (typeof platforms)[number]) => (
    <FilterCheckLink
      key={platform}
      href={toggleHref(recordQueryKeys.platform, platform)}
      active={query.platforms.includes(platform)}
      label={enums.platform[platform]}
    />
  );

  if (!collapsed) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {platforms.map(platformLink)}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {platforms.slice(0, visiblePlatformCount).map(platformLink)}
      <details className="group flex flex-col">
        <summary className="mt-0.5 cursor-pointer list-none text-primary text-xs group-open:hidden">
          {showAllLabel}
        </summary>
        <div className="flex flex-col gap-2">
          {platforms.slice(visiblePlatformCount).map(platformLink)}
        </div>
      </details>
    </div>
  );
}

export function MoodOptions({
  basePath,
  query,
  values,
  enums,
}: FilterOptionsProps) {
  const toggleHref = toggleHrefFor(basePath, values);
  return (
    <div className="flex flex-wrap gap-1.5">
      {moodTagSchema.options.map((mood) => (
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
  );
}

export function GenreOptions({
  basePath,
  query,
  values,
  enums,
}: FilterOptionsProps) {
  const toggleHref = toggleHrefFor(basePath, values);
  return (
    <div className="flex flex-wrap gap-1.5">
      {genreSchema.options.map((genre) => (
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
  );
}

export function RecordFilterPanel({
  dict,
  sortDict,
  ...props
}: RecordFilterPanelProps) {
  return (
    <div className="flex flex-col gap-5.5">
      <Section title={sortDict.label}>
        <SortOptions {...props} sortDict={sortDict} />
      </Section>
      <Section title={dict.score}>
        <ScoreOptions {...props} />
      </Section>
      <Section title={dict.platform}>
        <PlatformOptions
          {...props}
          collapsed
          showAllLabel={interpolate(dict.showAllPlatforms, {
            count: platformSchema.options.length,
          })}
        />
      </Section>
      <Section title={dict.moodTag}>
        <MoodOptions {...props} />
      </Section>
      <Section title={dict.genre} dashed>
        <GenreOptions {...props} />
      </Section>
    </div>
  );
}
