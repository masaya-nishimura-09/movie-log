import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { onRequestError } from "@/instrumentation";
import { logError } from "@/lib/log/logger";

const context = {
  routerKind: "App Router",
  routePath: "/[lang]/records",
  routeType: "render",
  renderSource: "react-server-components",
  revalidateReason: undefined,
} as const;

function request(cookie?: string | string[]) {
  return {
    path: "/ja/records",
    method: "GET",
    headers: cookie === undefined ? {} : { cookie },
  };
}

function token(userId: number) {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({})}.${encode({ UserID: userId })}.x`;
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function lines() {
  return vi
    .mocked(console.error)
    .mock.calls.map((call) => JSON.parse(String(call[0])));
}

describe("onRequestError", () => {
  it("logs the error with the user from the access token cookie", async () => {
    await onRequestError(
      new Error("boom"),
      request(`theme=dark; access_token=${token(7)}`),
      context,
    );
    expect(lines()).toEqual([
      expect.objectContaining({
        event: "request_failed",
        userId: "7",
        message: "boom",
      }),
    ]);
  });

  it("reads the cookie when it is given as several headers", async () => {
    await onRequestError(
      new Error("boom"),
      request(["theme=dark", `access_token=${token(8)}`]),
      context,
    );
    expect(lines()[0]).toMatchObject({ userId: "8" });
  });

  it("logs without a user when there is no cookie", async () => {
    await onRequestError(new Error("boom"), request(), context);
    expect(lines()[0]).not.toHaveProperty("userId");
  });

  it("skips an error that was already logged", async () => {
    const error = new Error("boom");
    logError("error", "api_request_failed", error);
    await onRequestError(error, request(), context);
    expect(lines()).toHaveLength(1);
  });
});
