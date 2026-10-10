import { z } from "zod";
import type { QueryValues } from "@/lib/url/build-href";
import {
  genreSchema,
  moodTagSchema,
  platformSchema,
  scoreSchema,
} from "@/schemas/record/enums";
import type { RecordQuery } from "@/schemas/record/list";
import { recordSortSchema } from "@/schemas/record/list";

export type SearchParams = Record<string, string | string[] | undefined>;

export const recordQueryKeys = {
  score: "score",
  platform: "platform",
  moodTag: "mood",
  genre: "genre",
  keyword: "q",
  sort: "sort",
  page: "page",
} as const;

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function pickValid<T>(schema: z.ZodType<T>, values: string[]): T[] {
  const valid = values.flatMap((value) => {
    const result = schema.safeParse(value);
    return result.success ? [result.data] : [];
  });
  return [...new Set(valid)];
}

export function toQueryValues(query: RecordQuery): QueryValues {
  return {
    [recordQueryKeys.score]:
      query.score === undefined ? undefined : String(query.score),
    [recordQueryKeys.platform]: query.platform,
    [recordQueryKeys.moodTag]: query.moodTags,
    [recordQueryKeys.genre]: query.genres,
    [recordQueryKeys.keyword]: query.keyword,
    [recordQueryKeys.sort]:
      query.sort === "watchedAtDesc" ? undefined : query.sort,
    [recordQueryKeys.page]: query.page === 1 ? undefined : String(query.page),
  };
}

export function parseRecordQuery(params: SearchParams): RecordQuery {
  const keyword = toArray(params[recordQueryKeys.keyword])[0] ?? "";
  const sort = recordSortSchema.safeParse(params[recordQueryKeys.sort]);
  const page = z.coerce
    .number()
    .int()
    .min(1)
    .safeParse(params[recordQueryKeys.page]);

  return {
    score: pickValid(
      z.coerce.number().pipe(scoreSchema),
      toArray(params[recordQueryKeys.score]),
    )[0],
    platform: pickValid(
      platformSchema,
      toArray(params[recordQueryKeys.platform]),
    )[0],
    moodTags: pickValid(
      moodTagSchema,
      toArray(params[recordQueryKeys.moodTag]),
    ),
    genres: pickValid(genreSchema, toArray(params[recordQueryKeys.genre])),
    keyword: keyword.trim(),
    sort: sort.success ? sort.data : "watchedAtDesc",
    page: page.success ? page.data : 1,
  };
}
