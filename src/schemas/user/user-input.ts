import { z } from "zod";

export const userInputSchema = z.object({
  username: z.string().min(1).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/^[!-~]+$/),
});

export type UserInput = z.infer<typeof userInputSchema>;

export function toUserRequest(input: UserInput) {
  return { name: input.username, email: input.email, password: input.password };
}
