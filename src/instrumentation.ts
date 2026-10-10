import type { Instrumentation } from "next";
import { accessTokenCookie } from "@/lib/auth/token-cookies";
import { logError, wasLogged } from "@/lib/log/logger";

function readCookie(header: string | string[] | undefined, name: string) {
  const cookie = Array.isArray(header) ? header.join("; ") : header;
  return cookie
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === name)?.[1];
}

export const onRequestError: Instrumentation.onRequestError = (
  error,
  request,
) => {
  if (wasLogged(error)) return;
  logError("error", "request_failed", error, {
    accessToken: readCookie(request.headers.cookie, accessTokenCookie),
  });
};
