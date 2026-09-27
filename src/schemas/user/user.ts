import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.email(),
  recordCount: z.number().int().min(0),
});

export type User = z.infer<typeof userSchema>;
