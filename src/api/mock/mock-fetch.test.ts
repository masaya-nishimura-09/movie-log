import { beforeEach, describe, expect, it, vi } from "vitest";
import { extraArticleCount } from "@/api/mock/mock-articles-extra";
import { fakeJwt } from "@/test/fake-jwt";

let mockFetch: typeof import("@/api/mock/mock-fetch").mockFetch;

beforeEach(async () => {
  const store = globalThis as Record<string, unknown>;
  delete store.mockRecords;
  delete store.mockRecordOwners;
  delete store.mockArticles;
  delete store.mockAccounts;
  vi.resetModules();
  vi.stubEnv("MOCK_DATASET", "");
  vi.stubEnv("MOCK_LANGUAGE", "");
  ({ mockFetch } = await import("@/api/mock/mock-fetch"));
});

function post(body: unknown, method = "POST", headers: HeadersInit = {}) {
  return {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  };
}

async function tokens(email = "demo@example.com", password = "password") {
  const response = await mockFetch("/auth/login", post({ email, password }));
  return response.json();
}

async function auth(email?: string, password?: string) {
  const { access_token } = await tokens(email, password);
  return { Authorization: `Bearer ${access_token}` };
}

async function register(name = "tester", email = "tester@example.com") {
  await mockFetch(
    "/users/register",
    post({ name, email, password: "password" }),
  );
  return auth(email);
}

const newRecord = {
  title: "Arrival",
  release_year: 2016,
  runtime: 116,
  genres: ["drama"],
  countries: ["US"],
  language: "en",
  credits: [],
  poster_url: "",
  watched_at: "2026-10-01T12:00:00Z",
  platform: "netflix",
  score: 5,
  mood_tags: ["moving"],
  memo: "",
};

async function list(headers: HeadersInit, query = "") {
  const response = await mockFetch(`/records/?${query}`, { headers });
  return { status: response.status, body: await response.json() };
}

describe("mockFetch: 認証", () => {
  it("logs in the demo account and rejects a wrong password", async () => {
    const ok = await mockFetch(
      "/auth/login",
      post({ email: "demo@example.com", password: "password" }),
    );
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({
      access_token: expect.stringMatching(/\.mock$/),
      refresh_token: expect.stringMatching(/^mock-refresh-1\./),
    });
    const ng = await mockFetch(
      "/auth/login",
      post({ email: "demo@example.com", password: "wrong" }),
    );
    expect(ng.status).toBe(401);
    expect(await ng.json()).toMatchObject({ code: "INVALID_CREDENTIALS" });
  });

  it("refreshes tokens with a valid refresh token only", async () => {
    const { refresh_token } = await tokens();
    const ok = await mockFetch("/auth/refresh", post({ refresh_token }));
    expect(ok.status).toBe(200);
    const ng = await mockFetch(
      "/auth/refresh",
      post({ refresh_token: "invalid" }),
    );
    expect(await ng.json()).toMatchObject({ code: "INVALID_REFRESH_TOKEN" });
  });

  it("logs out", async () => {
    const response = await mockFetch("/auth/logout", post({}));
    expect(response.status).toBe(204);
  });

  it("rejects requests without a valid access token", async () => {
    const none = await mockFetch("/users/", {});
    expect(await none.json()).toMatchObject({ code: "UNAUTHENTICATED" });
    const invalid = await mockFetch("/users/", {
      headers: { Authorization: "Bearer invalid" },
    });
    expect(await invalid.json()).toMatchObject({
      code: "INVALID_ACCESS_TOKEN",
    });
    const expired = await mockFetch("/users/", {
      headers: {
        Authorization: `Bearer ${fakeJwt({ sub: "1", exp: 1 }, "mock")}`,
      },
    });
    expect(await expired.json()).toMatchObject({
      code: "INVALID_ACCESS_TOKEN",
    });
  });
});

describe("mockFetch: ユーザー", () => {
  it("registers a user and rejects a duplicate email", async () => {
    const created = await mockFetch(
      "/users/register",
      post({
        name: "tester",
        email: "tester@example.com",
        password: "password",
      }),
    );
    expect(created.status).toBe(201);
    expect(await created.json()).toEqual({
      user_id: "2",
      username: "tester",
      email: "tester@example.com",
    });
    const duplicate = await mockFetch(
      "/users/register",
      post({ name: "x", email: "demo@example.com", password: "password" }),
    );
    expect(await duplicate.json()).toMatchObject({
      code: "USER_ALREADY_EXISTS",
    });
  });

  it("gets and deletes the current user", async () => {
    const headers = await register();
    const current = await mockFetch("/users/", { headers });
    expect(await current.json()).toEqual({
      user_id: "2",
      username: "tester",
      email: "tester@example.com",
    });
    const deleted = await mockFetch("/users/", { method: "DELETE", headers });
    expect(deleted.status).toBe(204);
    const login = await mockFetch(
      "/auth/login",
      post({ email: "tester@example.com", password: "password" }),
    );
    expect(login.status).toBe(401);
  });

  it("updates the username", async () => {
    const headers = await register();
    const updated = await mockFetch(
      "/users/username",
      post({ name: "renamed" }, "PUT", headers),
    );
    expect(await updated.json()).toEqual({
      user_id: "2",
      username: "renamed",
      email: "tester@example.com",
    });
  });

  it("updates the email with the current password", async () => {
    const headers = await register();
    const updated = await mockFetch(
      "/users/email",
      post(
        { email: "renamed@example.com", password: "password" },
        "PUT",
        headers,
      ),
    );
    expect(await updated.json()).toEqual({
      user_id: "2",
      username: "tester",
      email: "renamed@example.com",
    });
    expect((await tokens("renamed@example.com")).access_token).toBeDefined();
  });

  it("rejects an email change with a wrong current password", async () => {
    const headers = await register();
    const response = await mockFetch(
      "/users/email",
      post({ email: "renamed@example.com", password: "wrong" }, "PUT", headers),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      code: "INVALID_CURRENT_PASSWORD",
    });
  });

  it("rejects an email used by another user", async () => {
    const headers = await register();
    const response = await mockFetch(
      "/users/email",
      post({ email: "demo@example.com", password: "password" }, "PUT", headers),
    );
    expect(await response.json()).toMatchObject({
      code: "USER_ALREADY_EXISTS",
    });
  });

  it("updates the password with the current password", async () => {
    const headers = await register();
    const updated = await mockFetch(
      "/users/password",
      post(
        { old_password: "password", new_password: "password2" },
        "PUT",
        headers,
      ),
    );
    expect(updated.status).toBe(200);
    const oldLogin = await mockFetch(
      "/auth/login",
      post({ email: "tester@example.com", password: "password" }),
    );
    expect(oldLogin.status).toBe(401);
    const newLogin = await mockFetch(
      "/auth/login",
      post({ email: "tester@example.com", password: "password2" }),
    );
    expect(newLogin.status).toBe(200);
  });

  it("rejects a password change with a wrong current password", async () => {
    const headers = await register();
    const response = await mockFetch(
      "/users/password",
      post(
        { old_password: "wrong", new_password: "password2" },
        "PUT",
        headers,
      ),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      code: "INVALID_CURRENT_PASSWORD",
    });
  });

  it("gives a new user an ID that no one uses, even after a withdrawal", async () => {
    const first = await register("first", "first@example.com");
    await register("second", "second@example.com");
    await mockFetch("/users/", { method: "DELETE", headers: first });
    const third = await register("third", "third@example.com");
    const created = await mockFetch(
      "/records/",
      post(newRecord, "POST", third),
    );
    expect(created.status).toBe(201);
    const second = await auth("second@example.com");
    expect((await list(second)).body.total_count).toBe(0);
  });

  it("deletes the records of a user who withdraws", async () => {
    const headers = await register();
    const { record_id } = await (
      await mockFetch("/records/", post(newRecord, "POST", headers))
    ).json();
    await mockFetch("/users/", { method: "DELETE", headers });
    const demo = await auth();
    const response = await mockFetch(`/records/${record_id}`, {
      headers: demo,
    });
    expect(response.status).toBe(404);
  });

  it("fails to withdraw a user named __withdraw_error__", async () => {
    const headers = await register("__withdraw_error__");
    const response = await mockFetch("/users/", { method: "DELETE", headers });
    expect(response.status).toBe(500);
  });
});

describe("mockFetch: 記録", () => {
  it("lists only the records of the current user", async () => {
    const demo = await list(await auth());
    expect(demo.body.total_count).toBeGreaterThan(0);
    const headers = await register();
    expect((await list(headers)).body).toEqual({
      records: [],
      filtered_count: 0,
      total_count: 0,
    });
  });

  it("creates, gets, updates and deletes a record of the current user", async () => {
    const headers = await register();
    const created = await mockFetch(
      "/records/",
      post(newRecord, "POST", headers),
    );
    expect(created.status).toBe(201);
    const { record_id, created_at } = await created.json();
    const got = await mockFetch(`/records/${record_id}`, { headers });
    expect(await got.json()).toMatchObject({ ...newRecord, record_id });
    const updated = await mockFetch(
      `/records/${record_id}`,
      post({ ...newRecord, title: "Arrival 2" }, "PUT", headers),
    );
    expect(await updated.json()).toMatchObject({
      title: "Arrival 2",
      record_id,
      created_at,
    });
    const deleted = await mockFetch(`/records/${record_id}`, {
      method: "DELETE",
      headers,
    });
    expect(deleted.status).toBe(204);
    const gone = await mockFetch(`/records/${record_id}`, { headers });
    expect(await gone.json()).toMatchObject({ code: "RECORD_NOT_FOUND" });
  });

  it("does not let a user read, update or delete another user's record", async () => {
    const headers = await register();
    for (const init of [
      { headers },
      post(newRecord, "PUT", headers),
      { method: "DELETE", headers },
    ]) {
      const response = await mockFetch("/records/1", init);
      expect(response.status).toBe(404);
    }
    const demo = await mockFetch("/records/1", { headers: await auth() });
    expect(demo.status).toBe(200);
  });

  it("filters by score, platform, mood tags, genres and title", async () => {
    const headers = await register();
    const records = [
      {
        ...newRecord,
        title: "Alpha",
        score: 5,
        platform: "netflix",
        mood_tags: ["moving", "dark"],
        genres: ["drama", "crime"],
      },
      {
        ...newRecord,
        title: "Beta",
        score: 4,
        platform: "hulu",
        mood_tags: ["moving"],
        genres: ["drama"],
      },
      {
        ...newRecord,
        title: "Gamma",
        score: 5,
        platform: "hulu",
        mood_tags: ["dark"],
        genres: ["crime"],
      },
    ];
    for (const record of records) {
      await mockFetch("/records/", post(record, "POST", headers));
    }
    const titles = async (query: string) =>
      (await list(headers, query)).body.records
        .map((r: { title: string }) => r.title)
        .sort();
    expect(await titles("score=5")).toEqual(["Alpha", "Gamma"]);
    expect(await titles("platform=hulu")).toEqual(["Beta", "Gamma"]);
    expect(await titles("mood_tags=moving&mood_tags=dark")).toEqual(["Alpha"]);
    expect(await titles("genres=crime")).toEqual(["Alpha", "Gamma"]);
    expect(await titles("title=ALP")).toEqual(["Alpha"]);
    expect((await list(headers, "score=5")).body).toMatchObject({
      filtered_count: 2,
      total_count: 3,
    });
  });

  it("sorts by each field in both orders, then by newest ID", async () => {
    const headers = await register();
    const records = [
      {
        ...newRecord,
        title: "B",
        score: 3,
        release_year: 2000,
        watched_at: "2026-01-02T00:00:00Z",
      },
      {
        ...newRecord,
        title: "A",
        score: 5,
        release_year: 2010,
        watched_at: "2026-01-01T00:00:00Z",
      },
      {
        ...newRecord,
        title: "C",
        score: 3,
        release_year: 1990,
        watched_at: "2026-01-03T00:00:00Z",
      },
    ];
    for (const record of records) {
      await mockFetch("/records/", post(record, "POST", headers));
    }
    const titles = async (field: string, order: string) =>
      (
        await list(headers, `sort_field=${field}&sort_order=${order}`)
      ).body.records.map((r: { title: string }) => r.title);
    expect(await titles("watched_at", "desc")).toEqual(["C", "B", "A"]);
    expect(await titles("watched_at", "asc")).toEqual(["A", "B", "C"]);
    expect(await titles("score", "desc")).toEqual(["A", "C", "B"]);
    expect(await titles("release_year", "desc")).toEqual(["A", "B", "C"]);
    expect(await titles("title", "asc")).toEqual(["A", "B", "C"]);
  });

  it("rejects an unknown sort", async () => {
    const headers = await auth();
    expect((await list(headers, "sort_field=unknown")).status).toBe(400);
    expect((await list(headers, "sort_order=up")).status).toBe(400);
  });

  it("splits the list into pages", async () => {
    const headers = await auth();
    const all = (await list(headers, "per_page=100")).body.records;
    const second = (await list(headers, "per_page=5&page=2")).body.records;
    expect(second).toEqual(all.slice(5, 10));
  });

  it("fails to delete a record whose memo is __delete_error__", async () => {
    const headers = await register();
    const { record_id } = await (
      await mockFetch(
        "/records/",
        post({ ...newRecord, memo: "__delete_error__" }, "POST", headers),
      )
    ).json();
    const response = await mockFetch(`/records/${record_id}`, {
      method: "DELETE",
      headers,
    });
    expect(response.status).toBe(500);
  });
});

const initialArticleCount = 6 + extraArticleCount;

describe("mockFetch: 記事", () => {
  const content = {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "本文" }] }],
  };
  const newArticle = { title: "感想", content };

  async function createRecord(headers: HeadersInit, title = "Arrival") {
    const response = await mockFetch(
      "/records/",
      post({ ...newRecord, title }, "POST", headers),
    );
    return (await response.json()).record_id as string;
  }

  async function createArticle(
    headers: HeadersInit,
    recordId: string,
    body: unknown = newArticle,
  ) {
    return mockFetch(
      "/articles/",
      post({ record_id: recordId, ...(body as object) }, "POST", headers),
    );
  }

  async function listArticles(headers: HeadersInit, query = "") {
    const response = await mockFetch(`/articles/?${query}`, { headers });
    return { status: response.status, body: await response.json() };
  }

  it("does not put the articles in the record", async () => {
    const response = await mockFetch("/records/1", { headers: await auth() });
    expect(await response.json()).not.toHaveProperty("articles");
  });

  describe("作成、取得、更新、削除", () => {
    it("creates, gets, updates and deletes an article of the current user", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const created = await createArticle(headers, recordId);
      expect(created.status).toBe(201);
      const { article_id, created_at } = await created.json();

      const got = await mockFetch(`/articles/${article_id}`, { headers });
      expect(await got.json()).toMatchObject({
        article_id,
        record: {
          record_id: recordId,
          title: "Arrival",
          release_year: 2016,
          poster_url: "",
        },
        ...newArticle,
      });

      const updated = await mockFetch(
        `/articles/${article_id}`,
        post({ ...newArticle, title: "感想 改" }, "PUT", headers),
      );
      expect(await updated.json()).toMatchObject({
        article_id,
        record: { record_id: recordId, title: "Arrival" },
        title: "感想 改",
        created_at,
      });

      const deleted = await mockFetch(`/articles/${article_id}`, {
        method: "DELETE",
        headers,
      });
      expect(deleted.status).toBe(204);
      const gone = await mockFetch(`/articles/${article_id}`, { headers });
      expect(gone.status).toBe(404);
      expect(await gone.json()).toMatchObject({ code: "ARTICLE_NOT_FOUND" });
    });

    it("rejects a record or article ID that is not a number, like the API", async () => {
      const headers = await register();
      for (const path of ["/records/abc", "/articles/abc", "/articles/1a"]) {
        const response = await mockFetch(path, { headers });
        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ code: "INVALID_INPUT" });
      }
    });

    it("gives a new article an ID that no one uses", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const first = await (await createArticle(headers, recordId)).json();
      const second = await (await createArticle(headers, recordId)).json();
      expect(Number(first.article_id)).toBeGreaterThan(initialArticleCount);
      expect(Number(second.article_id)).toBe(Number(first.article_id) + 1);
    });

    it("puts the record's title, release year and poster in the response of a created article", async () => {
      const headers = await register();
      const recordId = await createRecord(headers, "Arrival");
      const created = await (await createArticle(headers, recordId)).json();
      expect(created.record).toEqual({
        record_id: recordId,
        title: "Arrival",
        release_year: 2016,
        poster_url: "",
      });
      expect(created).not.toHaveProperty("record_id");
    });

    it("shows the new title of the record once the record is changed", async () => {
      const headers = await register();
      const recordId = await createRecord(headers, "Arrival");
      const { article_id } = await (
        await createArticle(headers, recordId)
      ).json();
      await mockFetch(
        `/records/${recordId}`,
        post(
          { ...newRecord, title: "Arrival 改", release_year: 1999 },
          "PUT",
          headers,
        ),
      );
      const got = await (
        await mockFetch(`/articles/${article_id}`, { headers })
      ).json();
      expect(got.record).toMatchObject({
        title: "Arrival 改",
        release_year: 1999,
      });
      const { body } = await listArticles(headers);
      expect(body.articles[0].record).toMatchObject({
        title: "Arrival 改",
        release_year: 1999,
      });
    });

    it("gives each article of a list the record it belongs to", async () => {
      const headers = await register();
      const a = await createRecord(headers, "Film A");
      const b = await createRecord(headers, "Film B");
      await createArticle(headers, a);
      await createArticle(headers, b);
      const { body } = await listArticles(
        headers,
        "sort_field=title&sort_order=asc",
      );
      const titles = body.articles.map(
        (x: { record: { title: string } }) => x.record.title,
      );
      expect(titles.sort()).toEqual(["Film A", "Film B"]);
    });

    it("does not let a user read, update or delete another user's article", async () => {
      const headers = await register();
      for (const init of [
        { headers },
        post(newArticle, "PUT", headers),
        { method: "DELETE", headers },
      ]) {
        const response = await mockFetch("/articles/1", init);
        expect(response.status).toBe(404);
      }
      const demo = await mockFetch("/articles/1", { headers: await auth() });
      expect(demo.status).toBe(200);
    });

    it("does not let a user create an article under another user's record", async () => {
      const headers = await register();
      const response = await createArticle(headers, "1");
      expect(response.status).toBe(404);
      expect(await response.json()).toMatchObject({ code: "RECORD_NOT_FOUND" });
    });

    it("returns 404 for an article under a record that does not exist", async () => {
      const response = await createArticle(await auth(), "999999");
      expect(response.status).toBe(404);
    });

    it("rejects an article without a record", async () => {
      const response = await mockFetch(
        "/articles/",
        post(newArticle, "POST", await register()),
      );
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ code: "INVALID_INPUT" });
    });

    it("rejects an article without a title or with a title over 255 characters", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      for (const title of ["", "a".repeat(256), undefined]) {
        const response = await createArticle(headers, recordId, {
          title,
          content,
        });
        expect(response.status).toBe(400);
        expect(await response.json()).toMatchObject({ code: "INVALID_INPUT" });
      }
      const ok = await createArticle(headers, recordId, {
        title: "a".repeat(255),
        content,
      });
      expect(ok.status).toBe(201);
    });

    it("rejects an article whose content is not a document object", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      for (const body of [
        { title: "感想" },
        { title: "感想", content: "text" },
        { title: "感想", content: [] },
        { title: "感想", content: null },
        { title: "感想", content: { type: "paragraph" } },
      ]) {
        expect((await createArticle(headers, recordId, body)).status).toBe(400);
      }
    });

    it("rejects an update with invalid input", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const { article_id } = await (
        await createArticle(headers, recordId)
      ).json();
      const response = await mockFetch(
        `/articles/${article_id}`,
        post({ title: "", content }, "PUT", headers),
      );
      expect(response.status).toBe(400);
    });

    it("returns 404 when updating an article that does not exist", async () => {
      const response = await mockFetch(
        "/articles/999999",
        post(newArticle, "PUT", await auth()),
      );
      expect(response.status).toBe(404);
    });

    it("deletes the articles of a record when the record is deleted", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const { article_id } = await (
        await createArticle(headers, recordId)
      ).json();
      await mockFetch(`/records/${recordId}`, { method: "DELETE", headers });
      const response = await mockFetch(`/articles/${article_id}`, { headers });
      expect(response.status).toBe(404);
    });

    it("deletes the articles of a user who withdraws", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      await createArticle(headers, recordId);
      const store = globalThis as { mockArticles?: unknown[] };
      const before = store.mockArticles?.length ?? 0;
      await mockFetch("/users/", { method: "DELETE", headers });
      expect(store.mockArticles?.length).toBe(before - 1);
    });

    it("fails to delete an article titled __delete_error__", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const { article_id } = await (
        await createArticle(headers, recordId, {
          title: "__delete_error__",
          content,
        })
      ).json();
      const response = await mockFetch(`/articles/${article_id}`, {
        method: "DELETE",
        headers,
      });
      expect(response.status).toBe(500);
    });

    it("returns 500 when the title is __error__", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const response = await createArticle(headers, recordId, {
        title: "__error__",
        content,
      });
      expect(response.status).toBe(500);
    });
  });

  describe("一覧", () => {
    it("lists the summaries of the current user's articles, without the content, with the counts", async () => {
      const { status, body } = await listArticles(await auth());
      expect(status).toBe(200);
      expect(body.articles).toHaveLength(20);
      expect(body.filtered_count).toBe(initialArticleCount);
      expect(body.total_count).toBe(initialArticleCount);
      expect(body.articles[0]).toEqual({
        article_id: expect.any(String),
        record: {
          record_id: expect.any(String),
          title: expect.any(String),
          release_year: expect.any(Number),
          poster_url: expect.any(String),
        },
        title: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      });
      expect(body.articles[0]).not.toHaveProperty("record_id");
    });

    it("returns an empty list for a user without articles", async () => {
      const { body } = await listArticles(await register());
      expect(body).toEqual({ articles: [], filtered_count: 0, total_count: 0 });
    });

    it("sorts by the creation date, newest first, by default", async () => {
      const { body } = await listArticles(await auth());
      const created = body.articles.map(
        (a: { created_at: string }) => a.created_at,
      );
      expect(created).toEqual([...created].sort().reverse());
    });

    it("sorts by each field in both orders", async () => {
      const headers = await auth();
      for (const field of ["created_at", "updated_at"]) {
        for (const order of ["asc", "desc"]) {
          const { body } = await listArticles(
            headers,
            `sort_field=${field}&sort_order=${order}`,
          );
          const values = body.articles.map(
            (a: Record<string, string>) => a[field],
          );
          const sorted = [...values].sort();
          expect(values).toEqual(order === "asc" ? sorted : sorted.reverse());
        }
      }
      const { body } = await listArticles(
        headers,
        "sort_field=title&sort_order=asc",
      );
      const titles = body.articles.map((a: { title: string }) => a.title);
      expect(titles).toEqual(
        [...titles].sort((a, b) => a.localeCompare(b, "ja")),
      );
    });

    it("filters by the record", async () => {
      const { body } = await listArticles(await auth(), "record_id=1");
      expect(
        body.articles.map(
          (a: { record: { record_id: string } }) => a.record.record_id,
        ),
      ).toEqual(["1", "1"]);
      expect(body.filtered_count).toBe(2);
      expect(body.total_count).toBe(initialArticleCount);
    });

    it("filters by a keyword in the title", async () => {
      const { body } = await listArticles(
        await auth(),
        `keyword=${encodeURIComponent("ジャンプカット")}`,
      );
      expect(body.articles.map((a: { title: string }) => a.title)).toEqual([
        "ジャンプカットが生んだ速度",
      ]);
    });

    it("filters by a keyword in the body, not only the title", async () => {
      const { body } = await listArticles(
        await auth(),
        `keyword=${encodeURIComponent("バルセロナ")}`,
      );
      expect(body.articles).toHaveLength(1);
      expect(body.articles[0].title).toBe("観終わってから何日か考えたこと");
    });

    it("ignores the case of a keyword", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      await createArticle(headers, recordId, {
        title: "Last Train",
        content,
      });
      const { body } = await listArticles(headers, "keyword=LAST%20train");
      expect(body.articles).toHaveLength(1);
    });

    it("combines the record and the keyword", async () => {
      const { body } = await listArticles(
        await auth(),
        `record_id=3&keyword=${encodeURIComponent("ダイナマイト")}`,
      );
      expect(body.filtered_count).toBe(1);
      expect(body.articles[0].record.record_id).toBe("3");
      const other = await listArticles(
        await auth(),
        `record_id=1&keyword=${encodeURIComponent("ダイナマイト")}`,
      );
      expect(other.body.filtered_count).toBe(0);
    });

    it("returns nothing for a keyword that matches no article", async () => {
      const { body } = await listArticles(await auth(), "keyword=zzzzzz");
      expect(body).toEqual({
        articles: [],
        filtered_count: 0,
        total_count: initialArticleCount,
      });
    });

    it("splits the list into pages that cover every article exactly once", async () => {
      const headers = await auth();
      const pages = Math.ceil(initialArticleCount / 4);
      const ids: string[] = [];
      for (let page = 1; page <= pages; page++) {
        const { body } = await listArticles(headers, `per_page=4&page=${page}`);
        expect(body.filtered_count).toBe(initialArticleCount);
        expect(body.articles.length).toBe(
          page < pages ? 4 : initialArticleCount - 4 * (pages - 1),
        );
        ids.push(
          ...body.articles.map((a: { article_id: string }) => a.article_id),
        );
      }
      expect(ids).toHaveLength(initialArticleCount);
      expect(new Set(ids).size).toBe(initialArticleCount);
    });

    it("has more than two pages of 20 so the paging can be tried", async () => {
      const headers = await auth();
      expect(initialArticleCount).toBeGreaterThan(40);
      const last = await listArticles(headers, "page=3");
      expect(last.body.articles.length).toBeGreaterThan(0);
      const beyond = await listArticles(headers, "page=4");
      expect(beyond.body.articles).toEqual([]);
    });

    it("returns an empty page past the end, with the counts unchanged", async () => {
      const { body } = await listArticles(await auth(), "page=99");
      expect(body.articles).toEqual([]);
      expect(body.filtered_count).toBe(initialArticleCount);
    });

    it("rejects an invalid query", async () => {
      const headers = await auth();
      for (const query of [
        "sort_field=score",
        "sort_order=up",
        "page=0",
        "page=x",
        "per_page=0",
        "per_page=101",
        "record_id=abc",
        `keyword=${"a".repeat(256)}`,
      ]) {
        const { status, body } = await listArticles(headers, query);
        expect(status, query).toBe(400);
        expect(body).toMatchObject({ code: "INVALID_INPUT" });
      }
    });

    it("returns 500 for a keyword of __error__", async () => {
      expect(
        (await listArticles(await auth(), "keyword=__error__")).status,
      ).toBe(500);
    });

    it("puts a new article in the list and drops a deleted article and a deleted record", async () => {
      const headers = await register();
      const recordId = await createRecord(headers);
      const { article_id } = await (
        await createArticle(headers, recordId)
      ).json();
      await createArticle(headers, recordId);
      expect((await listArticles(headers)).body.articles).toHaveLength(2);
      await mockFetch(`/articles/${article_id}`, { method: "DELETE", headers });
      expect((await listArticles(headers)).body.articles).toHaveLength(1);
      await mockFetch(`/records/${recordId}`, { method: "DELETE", headers });
      expect((await listArticles(headers)).body.articles).toEqual([]);
    });

    it("does not list another user's articles", async () => {
      const mine = await listArticles(await register());
      expect(mine.body.articles).toEqual([]);
      const filtered = await listArticles(
        await register("other", "o@e.com"),
        "record_id=1",
      );
      expect(filtered.body.articles).toEqual([]);
    });
  });
});

describe("mockFetch: 失敗を返す値", () => {
  it("returns 500 for a list searched with __error__", async () => {
    expect((await list(await auth(), "title=__error__")).status).toBe(500);
  });

  it("returns 500 or 429 when a submitted field is __error__ or __too_many__", async () => {
    const error = await mockFetch(
      "/auth/login",
      post({ email: "demo@example.com", password: "__error__" }),
    );
    expect(error.status).toBe(500);
    const tooMany = await mockFetch(
      "/users/register",
      post({
        name: "__too_many__",
        email: "a@example.com",
        password: "password",
      }),
    );
    expect(tooMany.status).toBe(429);
  });
});

describe("mockFetch: 映画とメディア", () => {
  it("searches movies by title and gets a movie", async () => {
    const headers = await auth();
    const search = await mockFetch("/movies/search?title=%E5%8B%9D%E6%89%8B", {
      headers,
    });
    const { movies } = await search.json();
    expect(movies[0]).toMatchObject({ id: 1, title: "勝手にしやがれ" });
    const movie = await mockFetch("/movies/1", { headers });
    expect(await movie.json()).toMatchObject({
      title: "勝手にしやがれ",
      release_year: 1960,
      origin_country: ["FR"],
    });
    const missing = await mockFetch("/movies/999999", { headers });
    expect(await missing.json()).toMatchObject({ code: "MOVIE_NOT_FOUND" });
    const empty = await mockFetch("/movies/search?title=", { headers });
    expect(empty.status).toBe(400);
  });

  it("accepts an image and rejects other files", async () => {
    const headers = await auth();
    const upload = (file: File) => {
      const body = new FormData();
      body.set("file", file);
      return mockFetch("/media/", { method: "POST", headers, body });
    };
    const ok = await upload(new File(["png"], "a.png", { type: "image/png" }));
    expect(ok.status).toBe(201);
    expect((await ok.json()).url).toMatch(
      /^https:\/\/mock\.invalid\/posters\//,
    );
    const text = await upload(new File(["x"], "a.txt", { type: "text/plain" }));
    expect(text.status).toBe(400);
    const empty = await upload(new File([], "a.png", { type: "image/png" }));
    expect(empty.status).toBe(400);
    const large = await upload(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "a.png", {
        type: "image/png",
      }),
    );
    expect(large.status).toBe(400);
  });

  it("returns 404 for an unknown path", async () => {
    const response = await mockFetch("/unknown", { headers: await auth() });
    expect(await response.json()).toMatchObject({ code: "NOT_FOUND" });
  });
});
