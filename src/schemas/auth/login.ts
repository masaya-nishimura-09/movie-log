import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email("invalidEmail"),
  password: z
    .string()
    .min(8, "invalidPassword")
    .max(72, "invalidPassword")
    .regex(/^[!-~]+$/, "invalidPassword"),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
