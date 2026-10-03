import type { ApiErrorCode } from "@/schemas/error/api-error";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
  ) {
    super(`API error ${status}: ${code}`);
    this.name = "ApiError";
  }
}
