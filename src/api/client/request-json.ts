import { cookies, headers as requestHeaders } from "next/headers";
import type { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { mockFetch } from "@/api/mock/mock-fetch";
import { accessTokenCookie } from "@/lib/auth/token-cookies";
import { logError } from "@/lib/log/logger";
import { apiErrorResponseSchema } from "@/schemas/error/api-error";

const useMock = process.env.USE_MOCK === "true";

async function clientHeaders(init: RequestInit): Promise<Headers> {
  const headers = new Headers(init.headers);
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return headers;

  const incoming = await requestHeaders();
  const clientIp =
    incoming.get("x-real-ip") ??
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim();
  headers.set("X-Internal-Secret", secret);
  if (clientIp) headers.set("X-Real-IP", clientIp);
  return headers;
}

async function send(path: string, init: RequestInit): Promise<Response> {
  if (useMock) return mockFetch(path, init);

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL is not set");
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers: await clientHeaders(init),
  });
}

async function log(
  level: "error" | "warn",
  event: string,
  error: unknown,
  path: string,
) {
  const accessToken = (await cookies()).get(accessTokenCookie)?.value;
  logError(level, event, error, { path, accessToken });
}

export async function requestJson<T extends z.ZodType>(
  path: string,
  schema: T,
  init: RequestInit = {},
): Promise<z.output<T>> {
  let response: Response;
  try {
    response = await send(path, init);
  } catch (error) {
    await log("error", "api_request_failed", error, path);
    throw error;
  }
  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const parsed = apiErrorResponseSchema.safeParse(body);
    const error = new ApiError(
      response.status,
      parsed.success ? parsed.data.code : "INTERNAL_SERVER_ERROR",
    );
    if (response.status >= 500) {
      await log("error", "api_request_failed", error, path);
    } else if (response.status === 429) {
      await log("warn", "api_rate_limited", error, path);
    }
    throw error;
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    await log("error", "api_response_invalid", result.error, path);
    throw result.error;
  }
  return result.data;
}

export function jsonBody(body: unknown, method = "POST"): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
