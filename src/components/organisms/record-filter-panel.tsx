import type { ReactNode } from "react";
import { FilterChipLink } from "@/components/molecules/filter-chip-link";
import { FilterRadioLink } from "@/components/molecules/filter-radio-link";
import { SortSelect } from "@/components/molecules/sort-select";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import {
  buildHref,
  type QueryValues,
  selectValue,
  toggleValue,
} from "@/lib/url/build-href";
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.25">
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

function selectHrefFor(basePath: string, values: QueryValues) {
  return (key: string, value: string) =>
    buildHref(basePath, selectValue(values, key, value));
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
  const selectHref = selectHrefFor(basePath, values);
  return (
    <div className="flex gap-1.5">
      {scores.toReversed().map((score) => (
        <FilterChipLink
          key={score}
          shape="block"
          size="sm"
          href={selectHref(recordQueryKeys.score, String(score))}
          active={query.score === score}
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
  const selectHref = selectHrefFor(basePath, values);
  const platforms = platformSchema.options;
  const platformLink = (platform: (typeof platforms)[number]) => (
    <FilterRadioLink
      key={platform}
      href={selectHref(recordQueryKeys.platform, platform)}
      active={query.platform === platform}
      label={enums.platform[platform]}
    />
  );

  if (!collapsed) {
    return (
      <div role="radiogroup" className="grid grid-cols-2 gap-x-4 gap-y-2">
        {platforms.map(platformLink)}
      </div>
    );
  }
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {platforms.slice(0, visiblePlatformCount).map(platformLink)}
      <details
        open={
          query.platform !== undefined &&
          platforms.indexOf(query.platform) >= visiblePlatformCount
        }
        className="group flex flex-col"
      >
        <summary className="mt-0.5 cursor-pointer list-none font-medium text-primary text-xs group-open:hidden">
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
          tone="mood"
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
    <div className="flex flex-col gap-8">
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
      <Section title={dict.genre}>
        <GenreOptions {...props} />
      </Section>
    </div>
  );
}
