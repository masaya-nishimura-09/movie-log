import { z } from "zod";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; messageKey: string; errors?: Record<string, string[]> };

export function invalidInput(error: z.ZodError): ActionResult<never> {
  return {
    success: false,
    messageKey: "invalidInput",
    errors: z.flattenError(error).fieldErrors,
  };
}
