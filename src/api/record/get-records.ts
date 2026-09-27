import { mockRecords } from "@/api/record/mock-records";
import type {
  RecordList,
  RecordQuery,
  RecordSort,
} from "@/schemas/record/list";
import type { MovieRecord } from "@/schemas/record/record";

const perPage = 12;

const comparators: Record<
  RecordSort,
  (a: MovieRecord, b: MovieRecord) => number
> = {
  watchedAtDesc: (a, b) => b.watchedAt.localeCompare(a.watchedAt),
  watchedAtAsc: (a, b) => a.watchedAt.localeCompare(b.watchedAt),
  scoreDesc: (a, b) => b.score - a.score,
  releaseYearDesc: (a, b) => b.releaseYear - a.releaseYear,
  titleAsc: (a, b) => a.title.localeCompare(b.title, "ja"),
};

type Facet = "scores" | "platforms" | "moodTags" | "genres";

function matches(
  record: MovieRecord,
  query: RecordQuery,
  ignore?: Facet,
): boolean {
  return (
    (ignore === "scores" ||
      query.scores.length === 0 ||
      query.scores.includes(record.score)) &&
    (ignore === "platforms" ||
      query.platforms.length === 0 ||
      query.platforms.includes(record.platform)) &&
    (ignore === "moodTags" ||
      query.moodTags.every((tag) => record.moodTags.includes(tag))) &&
    (ignore === "genres" ||
      query.genres.every((genre) => record.genres.includes(genre))) &&
    record.title.includes(query.keyword)
  );
}

function countFacet(
  query: RecordQuery,
  facet: Facet,
  pick: (record: MovieRecord) => string[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const record of mockRecords) {
    if (!matches(record, query, facet)) continue;
    for (const value of pick(record)) {
      counts[value] = (counts[value] ?? 0) + 1;
    }
  }
  return counts;
}

export async function getRecords(query: RecordQuery): Promise<RecordList> {
  const filtered = mockRecords
    .filter((record) => matches(record, query))
    .sort(comparators[query.sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(query.page, pageCount);

  return {
    records: filtered.slice((page - 1) * perPage, page * perPage),
    totalCount: mockRecords.length,
    filteredCount: filtered.length,
    page,
    pageCount,
    facets: {
      scores: countFacet(query, "scores", (r) => [String(r.score)]),
      platforms: countFacet(query, "platforms", (r) => [r.platform]),
      moodTags: countFacet(query, "moodTags", (r) => r.moodTags),
      genres: countFacet(query, "genres", (r) => r.genres),
    },
  };
}
