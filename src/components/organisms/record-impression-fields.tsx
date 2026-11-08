import { ChoiceChip } from "@/components/atoms/choice-chip";
import { FormField } from "@/components/molecules/form-field";
import { NoteEditor } from "@/components/molecules/note-editor";
import type { Dictionary } from "@/i18n/get-dictionary";
import { fieldError, type RecordFieldErrors } from "@/lib/record/field-error";
import { moodTagSchema } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordImpressionFieldsProps = {
  values: RecordFormValues;
  errors?: RecordFieldErrors;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  editorDict: Dictionary["noteEditor"];
};

export function RecordImpressionFields({
  values,
  errors,
  dict,
  enums,
  editorDict,
}: RecordImpressionFieldsProps) {
  return (
    <div className="flex flex-col gap-4.5">
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
              tone="mood"
              className="text-[13px]"
              defaultChecked={values.moodTags.includes(mood)}
            >
              {enums.moodTag[mood]}
            </ChoiceChip>
          ))}
        </div>
      </FormField>

      <FormField
        label={dict.note}
        error={fieldError(errors, dict, "note")}
        htmlFor="note"
      >
        <NoteEditor
          id="note"
          name="note"
          defaultValue={values.note}
          dict={editorDict}
          invalid={Boolean(errors?.note)}
        />
      </FormField>
    </div>
  );
}
