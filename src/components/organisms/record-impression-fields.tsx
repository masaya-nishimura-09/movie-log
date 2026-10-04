import { ChoiceChip } from "@/components/atoms/choice-chip";
import { CountedTextarea } from "@/components/molecules/counted-textarea";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { cn } from "@/lib/style/cn";
import { moodTagSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordImpressionFieldsProps = {
  values: RecordFormValues;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  split?: boolean;
};

export function RecordImpressionFields({
  values,
  errors,
  dict,
  enums,
  counterTemplate,
  split = false,
}: RecordImpressionFieldsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4.5",
        split && "xl:grid xl:grid-cols-2 xl:items-start xl:gap-8",
      )}
    >
      <FormField
        label={dict.moodTags}
        error={fieldError(errors, dict, "moodTags")}
        hint={dict.moodTagsHint}
      >
        <div className="flex flex-wrap gap-1.75">
          {moodTagSchema.options.map((mood) => (
            <ChoiceChip
              key={mood}
              type="checkbox"
              name="moodTags"
              value={mood}
              size="sm"
              className="text-[13px]"
              defaultChecked={values.moodTags.includes(mood)}
            >
              {enums.moodTag[mood]}
            </ChoiceChip>
          ))}
        </div>
      </FormField>

      <FormField
        label={dict.memo}
        error={fieldError(errors, dict, "memo")}
        htmlFor="memo"
      >
        <CountedTextarea
          id="memo"
          name="memo"
          maxLength={1000}
          defaultValue={values.memo}
          counterTemplate={counterTemplate}
        />
      </FormField>
    </div>
  );
}
