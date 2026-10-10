import { headers as requestHeaders } from "next/headers";
import type { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { mockFetch } from "@/api/mock/mock-fetch";
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

export async function requestJson<T extends z.ZodType>(
  path: string,
  schema: T,
  init: RequestInit = {},
): Promise<z.output<T>> {
  const response = await send(path, init);
  const body: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const error = apiErrorResponseSchema.safeParse(body);
    throw new ApiError(
      response.status,
      error.success ? error.data.code : "INTERNAL_SERVER_ERROR",
    );
  }
  return schema.parse(body);
}

export function jsonBody(body: unknown, method = "POST"): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
