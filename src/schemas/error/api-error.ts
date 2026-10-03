import { z } from "zod";

export const apiErrorCodeSchema = z.enum([
  "INVALID_INPUT",
  "INVALID_ACCESS_TOKEN",
  "INVALID_REFRESH_TOKEN",
  "INVALID_CREDENTIALS",
  "UNAUTHENTICATED",
  "NOT_FOUND",
  "USER_NOT_FOUND",
  "RECORD_NOT_FOUND",
  "MOVIE_NOT_FOUND",
  "USER_ALREADY_EXISTS",
  "TOO_MANY_REQUESTS",
  "INTERNAL_SERVER_ERROR",
]);

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorResponseSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
