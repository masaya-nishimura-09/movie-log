import type { z } from "zod";
import { ApiError } from "@/api/client/api-error";
import { mockFetch } from "@/api/mock/mock-fetch";
import { apiErrorResponseSchema } from "@/schemas/error/api-error";

const useMock = process.env.USE_MOCK === "true";

async function send(path: string, init: RequestInit): Promise<Response> {
  if (useMock) return mockFetch(path, init);

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL is not set");
  return fetch(`${baseUrl}${path}`, init);
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
