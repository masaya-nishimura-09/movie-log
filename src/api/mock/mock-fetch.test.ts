import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeJwt } from "@/test/fake-jwt";

let mockFetch: typeof import("@/api/mock/mock-fetch").mockFetch;

beforeEach(async () => {
  const store = globalThis as Record<string, unknown>;
  delete store.mockRecords;
  delete store.mockRecordOwners;
  delete store.mockNotes;
  delete store.mockAttachments;
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

  it("saves, returns, updates and deletes the note of a record", async () => {
    const headers = await register();
    const note = (text: string) => ({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    });
    const created = await (
      await mockFetch(
        "/records/",
        post({ ...newRecord, note: note("最初") }, "POST", headers),
      )
    ).json();
    expect(created.note).toMatchObject({ content: note("最初") });
    const got = await (
      await mockFetch(`/records/${created.record_id}`, { headers })
    ).json();
    expect(got.note).toEqual({
      content: note("最初"),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
    const listed = (await list(headers)).body.records[0];
    expect(listed).not.toHaveProperty("note");
    await mockFetch(
      `/records/${created.record_id}`,
      post({ ...newRecord, note: note("二回目") }, "PUT", headers),
    );
    const updated = await (
      await mockFetch(`/records/${created.record_id}`, { headers })
    ).json();
    expect(updated.note.content).toEqual(note("二回目"));
    expect(updated.note.created_at).toBe(got.note.created_at);
    await mockFetch(
      `/records/${created.record_id}`,
      post({ ...newRecord }, "PUT", headers),
    );
    const kept = await (
      await mockFetch(`/records/${created.record_id}`, { headers })
    ).json();
    expect(kept.note.content).toEqual(note("二回目"));
    await mockFetch(
      `/records/${created.record_id}`,
      post({ ...newRecord, note: null }, "PUT", headers),
    );
    const cleared = await (
      await mockFetch(`/records/${created.record_id}`, { headers })
    ).json();
    expect(cleared.note).toBeNull();
  });

  it("finds records by the text of their notes, and includes notes only with include_note=true", async () => {
    const headers = await register();
    await mockFetch(
      "/records/",
      post(
        {
          ...newRecord,
          title: "別の題名",
          note: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "宇宙船の場面" }],
              },
            ],
          },
        },
        "POST",
        headers,
      ),
    );
    await mockFetch("/records/", post(newRecord, "POST", headers));
    const found = await list(headers, `title=${encodeURIComponent("宇宙船")}`);
    expect(found.body.records.map((r: { title: string }) => r.title)).toEqual([
      "別の題名",
    ]);
    const withNotes = await list(headers, "include_note=true");
    expect(
      withNotes.body.records.map((r: { note: unknown }) => r.note === null),
    ).toEqual([true, false]);
    expect((await list(headers, "include_note=yes")).status).toBe(400);
  });

  it("deletes the note together with the record", async () => {
    const headers = await register();
    const { record_id } = await (
      await mockFetch(
        "/records/",
        post(
          { ...newRecord, note: { type: "doc", content: [] } },
          "POST",
          headers,
        ),
      )
    ).json();
    await mockFetch(`/records/${record_id}`, { method: "DELETE", headers });
    const store = globalThis as { mockNotes?: Map<string, unknown> };
    expect(store.mockNotes?.has(record_id)).toBe(false);
  });

  it("seeds notes for the demo account's records", async () => {
    const got = await (
      await mockFetch("/records/1", { headers: await auth() })
    ).json();
    expect(got.note.content).toMatchObject({ type: "doc" });
  });

  it("fails to delete a record titled __delete_error__", async () => {
    const headers = await register();
    const { record_id } = await (
      await mockFetch(
        "/records/",
        post({ ...newRecord, title: "__delete_error__" }, "POST", headers),
      )
    ).json();
    const response = await mockFetch(`/records/${record_id}`, {
      method: "DELETE",
      headers,
    });
    expect(response.status).toBe(500);
  });

  it("counts the records of the current user by mood, every mood in alphabetical order", async () => {
    const headers = await register();
    for (const mood_tags of [["moving", "dark"], ["moving"]]) {
      await mockFetch(
        "/records/",
        post({ ...newRecord, mood_tags }, "POST", headers),
      );
    }
    const response = await mockFetch("/records/mood-counts", { headers });
    const { mood_tag_counts } = await response.json();
    const moods = mood_tag_counts.map((c: { mood_tag: string }) => c.mood_tag);
    expect(moods).toHaveLength(18);
    expect(moods).toEqual([...moods].sort());
    expect(mood_tag_counts).toContainEqual({ mood_tag: "moving", count: 2 });
    expect(mood_tag_counts).toContainEqual({ mood_tag: "dark", count: 1 });
    expect(mood_tag_counts).toContainEqual({ mood_tag: "cozy", count: 0 });
  });

  it("lists the attachments of the current user's record, and none of another user's", async () => {
    const demo = await mockFetch("/records/1/attachments", {
      headers: await auth(),
    });
    const { attachments } = await demo.json();
    expect(attachments.length).toBeGreaterThan(0);
    expect(attachments[0]).toEqual({
      attachment_id: expect.any(String),
      image_url: expect.stringMatching(/^\/mock-attachments\//),
      created_at: expect.any(String),
    });
    const other = await mockFetch("/records/1/attachments", {
      headers: await register(),
    });
    expect(other.status).toBe(404);
  });

  it("adds an image to the current user's record and deletes it", async () => {
    const headers = await auth();
    const body = new FormData();
    body.set("file", new File(["png"], "a.png", { type: "image/png" }));
    const added = await mockFetch("/records/1/attachments", {
      method: "POST",
      headers,
      body,
    });
    expect(added.status).toBe(201);
    const attachment = await added.json();
    expect(attachment.image_url).toBe(
      `data:image/png;base64,${Buffer.from("png").toString("base64")}`,
    );
    const listed = await mockFetch("/records/1/attachments", { headers });
    expect((await listed.json()).attachments).toContainEqual(attachment);
    const deleted = await mockFetch(
      `/records/1/attachments/${attachment.attachment_id}`,
      { method: "DELETE", headers },
    );
    expect(deleted.status).toBe(204);
    const again = await mockFetch(
      `/records/1/attachments/${attachment.attachment_id}`,
      { method: "DELETE", headers },
    );
    expect(await again.json()).toMatchObject({ code: "ATTACHMENT_NOT_FOUND" });
  });

  it("accepts up to 10 attachments on a record", async () => {
    const headers = await register();
    const { record_id } = await (
      await mockFetch("/records/", post(newRecord, "POST", headers))
    ).json();
    const attach = () => {
      const body = new FormData();
      body.set("file", new File(["x"], "a.png", { type: "image/png" }));
      return mockFetch(`/records/${record_id}/attachments`, {
        method: "POST",
        headers,
        body,
      });
    };
    for (let i = 0; i < 10; i++) expect((await attach()).status).toBe(201);
    expect((await attach()).status).toBe(400);
  });

  it("rejects a non-image attachment and another user's record", async () => {
    const body = new FormData();
    body.set("file", new File(["x"], "a.gif", { type: "image/gif" }));
    const invalid = await mockFetch("/records/1/attachments", {
      method: "POST",
      headers: await auth(),
      body,
    });
    expect(invalid.status).toBe(400);
    const other = await register();
    const png = new FormData();
    png.set("file", new File(["x"], "a.png", { type: "image/png" }));
    for (const init of [
      { method: "POST", headers: other, body: png },
      { method: "DELETE", headers: other },
    ]) {
      const path =
        init.method === "POST"
          ? "/records/1/attachments"
          : "/records/1/attachments/1";
      expect((await mockFetch(path, init)).status).toBe(404);
    }
  });

  it("removes the attachments together with the record", async () => {
    const headers = await auth();
    await mockFetch("/records/1", { method: "DELETE", headers });
    const store = globalThis as { mockAttachments?: { record_id: string }[] };
    expect(store.mockAttachments?.some((a) => a.record_id === "1")).toBe(false);
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
