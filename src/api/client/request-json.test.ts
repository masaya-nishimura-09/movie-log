import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { fakeJwt } from "@/test/fake-jwt";

const headerValues = new Map<string, string>();
const cookieValues = new Map<string, string>();

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: (name: string) => headerValues.get(name) ?? null,
  }),
  cookies: async () => ({
    get: (name: string) =>
      cookieValues.has(name) ? { value: cookieValues.get(name) } : undefined,
  }),
}));

const { jsonBody, requestJson } = await import("@/api/client/request-json");

const fetchMock = vi.fn();
const schema = z.object({ id: z.number() });

beforeEach(() => {
  headerValues.clear();
  cookieValues.clear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("API_BASE_URL", "https://api.example.com");
  vi.stubEnv("INTERNAL_API_SECRET", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

function logged(spy: unknown) {
  return (spy as { mock: { calls: unknown[][] } }).mock.calls.map((call) =>
    JSON.parse(String(call[0])),
  );
}

describe("requestJson", () => {
  it("requests the API and returns the parsed body", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await expect(requestJson("/records/1", schema)).resolves.toEqual({ id: 1 });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.example.com/records/1",
    );
  });

  it("keeps the method, body and headers of the request", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await requestJson("/records/", schema, jsonBody({ title: "A" }));
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init.method).toBe("POST");
    expect(init.body).toBe('{"title":"A"}');
    expect(init.headers.get("Content-Type")).toBe("application/json");
    expect(init.headers.has("X-Internal-Secret")).toBe(false);
  });

  it("sends the internal secret and the client IP when the secret is set", async () => {
    vi.stubEnv("INTERNAL_API_SECRET", "secret");
    headerValues.set("x-forwarded-for", "203.0.113.7, 10.0.0.1");
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await requestJson("/auth/login", schema);
    const headers = fetchMock.mock.calls[0]?.[1].headers;
    expect(headers.get("X-Internal-Secret")).toBe("secret");
    expect(headers.get("X-Real-IP")).toBe("203.0.113.7");
  });

  it("prefers x-real-ip for the client IP", async () => {
    vi.stubEnv("INTERNAL_API_SECRET", "secret");
    headerValues.set("x-real-ip", "198.51.100.1");
    headerValues.set("x-forwarded-for", "203.0.113.7");
    fetchMock.mockResolvedValue(Response.json({ id: 1 }));
    await requestJson("/auth/login", schema);
    expect(fetchMock.mock.calls[0]?.[1].headers.get("X-Real-IP")).toBe(
      "198.51.100.1",
    );
  });

  it("throws an ApiError with the code of an error response", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { code: "RECORD_NOT_FOUND", message: "x" },
        { status: 404 },
      ),
    );
    const error = await requestJson("/records/1", schema).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: "RECORD_NOT_FOUND" });
    expect(console.error).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("uses INTERNAL_SERVER_ERROR when the error body is not readable", async () => {
    fetchMock.mockResolvedValue(new Response("oops", { status: 502 }));
    const error = await requestJson("/records/1", schema).catch((e) => e);
    expect(error).toMatchObject({ status: 502, code: "INTERNAL_SERVER_ERROR" });
  });

  it("logs a server error as an error, with the user and the path", async () => {
    cookieValues.set("access_token", fakeJwt({ UserID: 7 }));
    fetchMock.mockResolvedValue(
      Response.json(
        { code: "INTERNAL_SERVER_ERROR", message: "x" },
        { status: 500 },
      ),
    );
    await requestJson("/records/?title=secret", schema).catch(() => {});
    expect(logged(console.error)).toEqual([
      expect.objectContaining({
        event: "api_request_failed",
        userId: "7",
        path: "/records/",
        status: 500,
      }),
    ]);
  });

  it("logs a rate limit as a warning", async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { code: "TOO_MANY_REQUESTS", message: "x" },
        { status: 429 },
      ),
    );
    await requestJson("/auth/login", schema).catch(() => {});
    expect(logged(console.warn)).toEqual([
      expect.objectContaining({ event: "api_rate_limited", status: 429 }),
    ]);
  });

  it("logs and rethrows a network error", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(requestJson("/records/1", schema)).rejects.toThrow(
      "fetch failed",
    );
    expect(logged(console.error)).toEqual([
      expect.objectContaining({
        event: "api_request_failed",
        message: "fetch failed",
      }),
    ]);
  });

  it("logs and throws when the response does not match the schema", async () => {
    fetchMock.mockResolvedValue(Response.json({ id: "1" }));
    await expect(requestJson("/records/1", schema)).rejects.toBeInstanceOf(
      z.ZodError,
    );
    expect(logged(console.error)).toEqual([
      expect.objectContaining({ event: "api_response_invalid" }),
    ]);
  });

  it("throws when API_BASE_URL is not set", async () => {
    vi.stubEnv("API_BASE_URL", "");
    await expect(requestJson("/records/1", schema)).rejects.toThrow(
      "API_BASE_URL is not set",
    );
  });
});

describe("jsonBody", () => {
  it("builds a JSON request with the given method", () => {
    expect(jsonBody({ a: 1 }, "PUT")).toEqual({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: '{"a":1}',
    });
  });
});
