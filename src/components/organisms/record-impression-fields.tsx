import { ChoiceChip } from "@/components/atoms/choice-chip";
import { CountedTextarea } from "@/components/molecules/counted-textarea";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import { moodTagSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordImpressionFieldsProps = {
  values: RecordFormValues;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

export function RecordImpressionFields({
  values,
  dict,
  enums,
  counterTemplate,
}: RecordImpressionFieldsProps) {
  return (
    <div className="flex flex-col gap-4.5">
      <FormField label={dict.moodTags} hint={dict.moodTagsHint}>
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

      <FormField label={dict.memo} htmlFor="memo">
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
