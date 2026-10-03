import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.email(),
});

export type User = z.infer<typeof userSchema>;

export const userResponseSchema = z
  .object({
    username: z.string(),
    email: z.email(),
  })
  .transform(
    (r): User => ({
      username: r.username,
      email: r.email,
    }),
  );

export type UserResponse = z.input<typeof userResponseSchema>;
