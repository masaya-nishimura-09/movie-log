import { z } from "zod";

export const tokenPairResponseSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
  })
  .transform((r) => ({
    accessToken: r.access_token,
    refreshToken: r.refresh_token,
  }));

export type TokenPair = z.output<typeof tokenPairResponseSchema>;
