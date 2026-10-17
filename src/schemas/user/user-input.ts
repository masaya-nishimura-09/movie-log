import { z } from "zod";

const usernameSchema = z.string().min(1).max(100);
const emailSchema = z.email();
const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/^[!-~]+$/);

export const userInputSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type UserInput = z.infer<typeof userInputSchema>;

export function toUserRequest(input: UserInput) {
  return { name: input.username, email: input.email, password: input.password };
}

export const usernameInputSchema = z.object({ username: usernameSchema });

export type UsernameInput = z.infer<typeof usernameInputSchema>;

export function toUsernameRequest(input: UsernameInput) {
  return { name: input.username };
}

export const emailChangeInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type EmailChangeInput = z.infer<typeof emailChangeInputSchema>;

export const passwordChangeInputSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

export type PasswordChangeInput = z.infer<typeof passwordChangeInputSchema>;

export function toPasswordChangeRequest(input: PasswordChangeInput) {
  return { old_password: input.oldPassword, new_password: input.newPassword };
}
