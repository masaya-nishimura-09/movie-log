"use client";

import { useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { phrases } from "@/components/atoms/phrases";
import { FormField } from "@/components/molecules/form-field";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";
import { interpolate } from "@/lib/text/interpolate";
import { customChoice, supportPresetAmounts } from "@/schemas/support/support";

type SupportFormProps = {
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  dict: Dictionary["support"];
};

export function SupportForm({ action, dict }: SupportFormProps) {
  const { failure, pending, submit } = useFormSubmit(action);
  const [choice, setChoice] = useState<string>();
  const fieldError = (name: string) =>
    dictMessage(dict, failure?.errors?.[name]?.[0]);

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-bold text-[13px] text-foreground">
          {dict.amountLabel}
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          {[...supportPresetAmounts.map(String), customChoice].map((value) => (
            <ChoiceChip
              key={value}
              type="radio"
              name="choice"
              value={value}
              shape="block"
              size="lg"
              checked={choice === value}
              onChange={() => setChoice(value)}
            >
              {value === customChoice
                ? dict.custom
                : interpolate(dict.amount, {
                    amount: Number(value).toLocaleString("ja-JP"),
                  })}
            </ChoiceChip>
          ))}
        </div>
        {fieldError("choice") && (
          <p className="text-destructive-foreground text-xs" role="alert">
            {fieldError("choice")}
          </p>
        )}
      </fieldset>
      {choice === customChoice && (
        <FormField
          label={dict.customAmountLabel}
          htmlFor="customAmount"
          hint={dict.customAmountHint}
          error={fieldError("customAmount")}
        >
          <Input
            id="customAmount"
            name="customAmount"
            inputMode="numeric"
            autoComplete="off"
            placeholder="500"
            aria-invalid={fieldError("customAmount") ? true : undefined}
          />
        </FormField>
      )}
      <p className="text-[13px] text-foreground-sub leading-relaxed">
        {phrases(dict.stripeNote)}
      </p>
      <Button
        type="submit"
        size="lg"
        pending={pending}
        pendingLabel={dict.submitting}
      >
        {dict.submit}
      </Button>
    </form>
  );
}
