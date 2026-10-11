import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/api/client/api-error";
import { logError, wasLogged } from "@/lib/log/logger";
import { fakeJwt } from "@/test/fake-jwt";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-11T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

function lastLine(spy: { mock: { calls: unknown[][] } }) {
  return JSON.parse(String(spy.mock.calls.at(-1)?.[0]));
}

describe("logError", () => {
  it("writes an error as one JSON line to console.error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("APP_VERSION", "abc123");
    const error = new Error("boom");
    logError("error", "request_failed", error, {
      path: "/records?q=secret",
      accessToken: fakeJwt({ UserID: 42 }),
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(lastLine(spy)).toEqual({
      time: "2026-10-11T00:00:00.000Z",
      level: "error",
      event: "request_failed",
      service: "movie-log-web",
      version: "abc123",
      userId: "42",
      path: "/records",
      name: "Error",
      message: "boom",
      stack: error.stack,
    });
  });

  it("writes a warning to console.warn", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logError(
      "warn",
      "api_rate_limited",
      new ApiError(429, "TOO_MANY_REQUESTS"),
    );
    expect(lastLine(spy)).toMatchObject({
      level: "warn",
      code: "TOO_MANY_REQUESTS",
      status: 429,
    });
  });

  it("reads the code and status of an ApiError from another bundle", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = Object.assign(new Error("API error"), {
      name: "ApiError",
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
    logError("error", "api_request_failed", error);
    expect(lastLine(spy)).toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
    });
  });

  it("logs values that are not errors as a message", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logError("error", "request_failed", "text");
    expect(lastLine(spy)).toMatchObject({ message: "text" });
    expect(lastLine(spy)).not.toHaveProperty("userId");
    expect(lastLine(spy)).not.toHaveProperty("version");
  });
});

describe("wasLogged", () => {
  it("is true only for errors that were logged", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const logged = new Error("logged");
    logError("error", "request_failed", logged);
    expect(wasLogged(logged)).toBe(true);
    expect(wasLogged(new Error("other"))).toBe(false);
    expect(wasLogged("text")).toBe(false);
    expect(wasLogged(null)).toBe(false);
  });
});
