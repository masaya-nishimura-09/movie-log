import { z } from "zod";

export const mediaUploadResponseSchema = z
  .object({ url: z.url() })
  .transform((r) => r.url);

export const posterMaxBytes = 5 * 1024 * 1024;

export const posterContentTypes = ["image/jpeg", "image/png", "image/webp"];
