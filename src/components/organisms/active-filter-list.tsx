import { ActiveFilterChips } from "@/components/molecules/active-filter-chips";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import {
  buildHref,
  type QueryValues,
  selectValue,
  toggleValue,
} from "@/lib/url/build-href";
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
    ...(query.score === undefined
      ? []
      : [
          {
            label: `${dict.score} ${query.score}`,
            href: buildHref(
              basePath,
              selectValue(values, recordQueryKeys.score, String(query.score)),
            ),
          },
        ]),
    ...(query.platform === undefined
      ? []
      : [
          {
            label: enums.platform[query.platform],
            href: buildHref(
              basePath,
              selectValue(values, recordQueryKeys.platform, query.platform),
            ),
          },
        ]),
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

  return (
    <ActiveFilterChips
      items={items}
      clearHref={clearHref}
      removeTemplate={dict.remove}
      clearAllLabel={dict.clearAll}
    />
  );
}
