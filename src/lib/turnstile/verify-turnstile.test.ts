import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const headerValues = new Map<string, string>();

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => headerValues.get(name) ?? null,
  }),
}));

async function load(useMock = false) {
  vi.resetModules();
  vi.stubEnv("USE_MOCK", useMock ? "true" : "false");
  return import("@/lib/turnstile/verify-turnstile");
}

function form(token: string | undefined) {
  const data = new FormData();
  if (token !== undefined) data.set("cf-turnstile-response", token);
  return data;
}

const fetchMock = vi.fn();

beforeEach(() => {
  headerValues.clear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("verifyTurnstile", () => {
  it("passes when siteverify succeeds, sending the secret, token and IP", async () => {
    const { verifyTurnstile } = await load();
    headerValues.set("x-real-ip", "203.0.113.7");
    fetchMock.mockResolvedValue(Response.json({ success: true }));
    await expect(verifyTurnstile(form("token"))).resolves.toBeUndefined();
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(Object.fromEntries(init.body)).toEqual({
      secret: "secret",
      response: "token",
      remoteip: "203.0.113.7",
    });
  });

  it("omits the IP when it is unknown", async () => {
    const { verifyTurnstile } = await load();
    fetchMock.mockResolvedValue(Response.json({ success: true }));
    await verifyTurnstile(form("token"));
    expect(fetchMock.mock.calls[0]?.[1].body.has("remoteip")).toBe(false);
  });

  it("fails when siteverify rejects the token", async () => {
    const { verifyTurnstile } = await load();
    fetchMock.mockResolvedValue(Response.json({ success: false }));
    await expect(verifyTurnstile(form("token"))).resolves.toBe(
      "verificationFailed",
    );
  });

  it("fails without calling siteverify when there is no token", async () => {
    const { verifyTurnstile } = await load();
    await expect(verifyTurnstile(form(undefined))).resolves.toBe(
      "verificationFailed",
    );
    await expect(verifyTurnstile(form(""))).resolves.toBe("verificationFailed");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns unexpectedError and logs when siteverify responds with an error", async () => {
    const { verifyTurnstile } = await load();
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    await expect(verifyTurnstile(form("token"))).resolves.toBe(
      "unexpectedError",
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('"event":"turnstile_verify_failed"'),
    );
  });

  it("returns unexpectedError when the secret key is not set", async () => {
    const { verifyTurnstile } = await load();
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile(form("token"))).resolves.toBe(
      "unexpectedError",
    );
  });

  it("skips the check in mock mode", async () => {
    const { verifyTurnstile } = await load(true);
    await expect(verifyTurnstile(form(undefined))).resolves.toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("turnstileSiteKey", () => {
  it("returns the site key", async () => {
    const { turnstileSiteKey } = await load();
    vi.stubEnv("TURNSTILE_SITE_KEY", "site-key");
    expect(turnstileSiteKey()).toBe("site-key");
  });

  it("returns undefined in mock mode", async () => {
    const { turnstileSiteKey } = await load(true);
    vi.stubEnv("TURNSTILE_SITE_KEY", "site-key");
    expect(turnstileSiteKey()).toBeUndefined();
  });
});
