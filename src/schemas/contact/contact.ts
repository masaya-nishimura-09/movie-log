import { z } from "zod";

export const contactMessageMaxLength = 2000;

export const honeypotField = "website";

export const contactInputSchema = z.object({
  email: z.email("invalidEmail"),
  message: z
    .string()
    .trim()
    .min(1, "messageRequired")
    .max(contactMessageMaxLength, "messageTooLong"),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
