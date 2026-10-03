import type { Dictionary } from "@/i18n/get-dictionary";
import type { RecordInputField } from "@/schemas/record/record-input";

export type RecordFieldErrors = Partial<Record<string, string[]>>;

export function fieldError(
  errors: RecordFieldErrors | undefined,
  dict: Dictionary["recordForm"],
  name: RecordInputField,
): string | undefined {
  return errors?.[name] ? dict.errors[name] : undefined;
}
