import { mockRecords } from "@/api/mock/mock-records";
import { mockAccounts, toUserResponse } from "@/api/mock/mock-user";
import { isTokenExpired } from "@/lib/auth/token-cookies";
import type { ApiErrorResponse } from "@/schemas/error/api-error";
import { posterContentTypes, posterMaxBytes } from "@/schemas/media/media";
import type { RecordResponse } from "@/schemas/record/record";

function error(status: number, code: ApiErrorResponse["code"]): Response {
  return Response.json({ code, message: code } satisfies ApiErrorResponse, {
    status,
  });
}

type SortField = "watched_at" | "release_year" | "score" | "title";

const comparators: Record<
  SortField,
  (a: RecordResponse, b: RecordResponse) => number
> = {
  watched_at: (a, b) => a.watched_at.localeCompare(b.watched_at),
  release_year: (a, b) => a.release_year - b.release_year,
  score: (a, b) => a.score - b.score,
  title: (a, b) => a.title.localeCompare(b.title, "ja"),
};

function isSortField(value: string): value is SortField {
  return value in comparators;
}

function byIdDesc(a: RecordResponse, b: RecordResponse): number {
  return Number(b.record_id) - Number(a.record_id);
}

type Filter = {
  score: string | null;
  platform: string | null;
  mood_tags: string[];
  genres: string[];
  title: string;
};

function allOf(selected: string[], values: string[]): boolean {
  return selected.every((value) => values.includes(value));
}

function matches(record: RecordResponse, filter: Filter): boolean {
  return (
    (filter.score === null || filter.score === String(record.score)) &&
    (filter.platform === null || filter.platform === record.platform) &&
    allOf(filter.mood_tags, record.mood_tags) &&
    allOf(filter.genres, record.genres) &&
    record.title.toLowerCase().includes(filter.title.toLowerCase())
  );
}

function listRecords(params: URLSearchParams): Response {
  const filter: Filter = {
    score: params.get("score"),
    platform: params.get("platform"),
    mood_tags: params.getAll("mood_tags"),
    genres: params.getAll("genres"),
    title: params.get("title") ?? "",
  };
  const sortField = params.get("sort_field") ?? "watched_at";
  const sortOrder = params.get("sort_order") ?? "desc";
  const page = Number(params.get("page") ?? "1");
  const perPage = Number(params.get("per_page") ?? "20");
  if (!isSortField(sortField) || !["asc", "desc"].includes(sortOrder)) {
    return error(400, "INVALID_INPUT");
  }
  const compare = comparators[sortField];

  const filtered = mockRecords
    .filter((record) => matches(record, filter))
    .sort(
      (a, b) =>
        (sortOrder === "asc" ? compare(a, b) : compare(b, a)) || byIdDesc(a, b),
    );

  return Response.json({
    records: filtered.slice((page - 1) * perPage, page * perPage),
    filtered_count: filtered.length,
    total_count: mockRecords.length,
  });
}

function getRecord(id: string): Response {
  const record = mockRecords.find((r) => r.record_id === id);
  if (!record) return error(404, "RECORD_NOT_FOUND");
  return Response.json(record);
}

const accessTokenLifetime = 60 * 60;
const refreshTokenPrefix = "mock-refresh-";

type Account = (typeof mockAccounts)[number];

function issueTokens(account: Account): Response {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + accessTokenLifetime;
  const sub = account.user_id;
  return Response.json({
    access_token: `${encode({ alg: "none" })}.${encode({ sub, exp })}.mock`,
    refresh_token: `${refreshTokenPrefix}${sub}.${crypto.randomUUID()}`,
  });
}

function readJson(init: RequestInit): Record<string, unknown> {
  try {
    return JSON.parse(String(init.body));
  } catch {
    return {};
  }
}

function login(init: RequestInit): Response {
  const { email, password } = readJson(init);
  const account = mockAccounts.find((a) => a.email === email);
  if (!account || account.password !== password) {
    return error(401, "INVALID_CREDENTIALS");
  }
  return issueTokens(account);
}

function refresh(init: RequestInit): Response {
  const { refresh_token: token } = readJson(init);
  const userId =
    typeof token === "string" && token.startsWith(refreshTokenPrefix)
      ? token.slice(refreshTokenPrefix.length).split(".")[0]
      : undefined;
  const account = mockAccounts.find((a) => a.user_id === userId);
  if (!account) return error(401, "INVALID_REFRESH_TOKEN");
  return issueTokens(account);
}

function authenticate(init: RequestInit): Account | Response {
  const authorization = new Headers(init.headers).get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return error(401, "UNAUTHENTICATED");
  }
  const token = authorization.slice("Bearer ".length);
  if (!token.endsWith(".mock") || isTokenExpired(token)) {
    return error(401, "INVALID_ACCESS_TOKEN");
  }
  const payload = token.split(".")[1] ?? "";
  const { sub } = JSON.parse(Buffer.from(payload, "base64url").toString());
  return (
    mockAccounts.find((a) => a.user_id === sub) ?? error(401, "UNAUTHENTICATED")
  );
}

type UserBody = { name?: unknown; email?: unknown; password?: unknown };

function emailTaken(email: unknown, except?: Account): boolean {
  return mockAccounts.some((a) => a.email === email && a !== except);
}

function register(init: RequestInit): Response {
  const { name, email, password } = readJson(init) as UserBody;
  if (emailTaken(email)) return error(409, "USER_ALREADY_EXISTS");
  const account: Account = {
    user_id: String(mockAccounts.length + 1),
    username: String(name),
    email: String(email),
    password: String(password),
  };
  mockAccounts.push(account);
  return Response.json(toUserResponse(account), { status: 201 });
}

function updateUser(account: Account, init: RequestInit): Response {
  const { name, email, password } = readJson(init) as UserBody;
  if (emailTaken(email, account)) return error(409, "USER_ALREADY_EXISTS");
  Object.assign(account, {
    username: String(name),
    email: String(email),
    password: String(password),
  });
  return Response.json(toUserResponse(account));
}

function deleteUser(account: Account): Response {
  mockAccounts.splice(mockAccounts.indexOf(account), 1);
  return new Response(null, { status: 204 });
}

type RecordBody = Omit<
  RecordResponse,
  "record_id" | "created_at" | "updated_at"
>;

function createRecord(init: RequestInit): Response {
  const now = new Date().toISOString();
  const lastId = Math.max(0, ...mockRecords.map((r) => Number(r.record_id)));
  const record: RecordResponse = {
    ...(readJson(init) as RecordBody),
    record_id: String(lastId + 1),
    created_at: now,
    updated_at: now,
  };
  mockRecords.push(record);
  return Response.json(record, { status: 201 });
}

function updateRecord(id: string, init: RequestInit): Response {
  const index = mockRecords.findIndex((r) => r.record_id === id);
  const current = mockRecords[index];
  if (!current) return error(404, "RECORD_NOT_FOUND");
  const record: RecordResponse = {
    ...(readJson(init) as RecordBody),
    record_id: id,
    created_at: current.created_at,
    updated_at: new Date().toISOString(),
  };
  mockRecords[index] = record;
  return Response.json(record);
}

function deleteRecord(id: string): Response {
  const index = mockRecords.findIndex((r) => r.record_id === id);
  if (index === -1) return error(404, "RECORD_NOT_FOUND");
  mockRecords.splice(index, 1);
  return new Response(null, { status: 204 });
}

function searchMovies(params: URLSearchParams): Response {
  const title = (params.get("title") ?? "").toLowerCase();
  if (title === "") return error(400, "INVALID_INPUT");
  const movies = mockRecords
    .filter((r) => r.title.toLowerCase().includes(title))
    .map((r) => ({
      id: Number(r.record_id),
      original_language: r.language,
      original_title: r.title,
      title: r.title,
      overview: "",
      poster_url: r.poster_url,
      release_year: r.release_year,
    }));
  return Response.json({
    page: 1,
    total_pages: 1,
    total_results: movies.length,
    movies,
  });
}

function getMovie(id: string): Response {
  const record = mockRecords.find((r) => r.record_id === id);
  if (!record) return error(404, "MOVIE_NOT_FOUND");
  return Response.json({
    id: Number(record.record_id),
    title: record.title,
    original_title: record.title,
    overview: "",
    genres: record.genres,
    poster_url: record.poster_url,
    release_year: record.release_year,
    runtime: record.runtime,
    original_language: record.language,
    origin_country: record.countries,
    credits: record.credits,
  });
}

function uploadMedia(init: RequestInit): Response {
  const file = init.body instanceof FormData ? init.body.get("file") : null;
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > posterMaxBytes ||
    !posterContentTypes.includes(file.type)
  ) {
    return error(400, "INVALID_INPUT");
  }
  return Response.json(
    { url: `https://mock.invalid/posters/${crypto.randomUUID()}` },
    { status: 201 },
  );
}

export async function mockFetch(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const url = new URL(path, "http://mock");
  const method = init.method ?? "GET";
  const [resource, id, sub] = url.pathname.split("/").filter(Boolean);

  if (method === "POST" && resource === "auth") {
    if (id === "login") return login(init);
    if (id === "refresh") return refresh(init);
    if (id === "logout") return new Response(null, { status: 204 });
  }
  if (method === "POST" && resource === "users" && id === "register") {
    return register(init);
  }

  const account = authenticate(init);
  if (account instanceof Response) return account;

  if (resource === "users" && id === undefined) {
    if (method === "GET") return Response.json(toUserResponse(account));
    if (method === "PUT") return updateUser(account, init);
    if (method === "DELETE") return deleteUser(account);
  }
  if (resource === "records" && id === undefined) {
    if (method === "GET") return listRecords(url.searchParams);
    if (method === "POST") return createRecord(init);
  }
  if (resource === "records" && id !== undefined && sub === undefined) {
    if (method === "GET") return getRecord(id);
    if (method === "PUT") return updateRecord(id, init);
    if (method === "DELETE") return deleteRecord(id);
  }
  if (method === "POST" && resource === "media" && id === undefined) {
    return uploadMedia(init);
  }
  if (method === "GET" && resource === "movies" && id !== undefined) {
    return id === "search" ? searchMovies(url.searchParams) : getMovie(id);
  }
  return error(404, "NOT_FOUND");
}
