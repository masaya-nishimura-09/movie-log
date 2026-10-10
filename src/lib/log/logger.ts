import { ApiError } from "@/api/client/api-error";
import { readJwtUserId } from "@/lib/auth/token-cookies";

type Level = "error" | "warn";

type LogContext = {
  path?: string;
  accessToken?: string;
};

const loggedMark = Symbol.for("movie-log.logged");

function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError ||
    (error instanceof Error &&
      error.name === "ApiError" &&
      "code" in error &&
      "status" in error)
  );
}

function errorFields(error: unknown) {
  if (isApiError(error)) {
    return { code: error.code, status: error.status };
  }
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export function logError(
  level: Level,
  event: string,
  error: unknown,
  { path, accessToken }: LogContext = {},
) {
  if (typeof error === "object" && error !== null) {
    Object.defineProperty(error, loggedMark, { value: true });
  }

  const entry = {
    time: new Date().toISOString(),
    level,
    event,
    service: "movie-log-web",
    version: process.env.APP_VERSION,
    userId: accessToken ? readJwtUserId(accessToken) : undefined,
    path: path?.split("?")[0],
    ...errorFields(error),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else console.warn(line);
}

export function wasLogged(error: unknown): boolean {
  return typeof error === "object" && error !== null && loggedMark in error;
}
