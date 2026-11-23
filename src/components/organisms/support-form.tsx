"use client";

import { useState } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Input } from "@/components/atoms/input";
import { phrases } from "@/components/atoms/phrases";
import { FormField } from "@/components/molecules/form-field";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { formStack, penInput } from "@/lib/style/paper";
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
    <form
      onSubmit={submit}
      noValidate
      className={cn(formStack, "mt-6 text-left", penInput)}
    >
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <fieldset className="flex flex-col">
        <legend className="sr-only">{dict.amountLabel}</legend>
        <div className="grid grid-cols-2 gap-y-2.5">
          {[...supportPresetAmounts.map(String), customChoice].map((value) => (
            <label
              key={value}
              className="group relative flex h-11.5 cursor-pointer items-center justify-center font-pen font-semibold text-[#1d3f66] text-[19px] has-focus-visible:rounded-md has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                name="choice"
                value={value}
                checked={choice === value}
                onChange={() => setChoice(value)}
                className="sr-only"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 120 50"
                preserveAspectRatio="none"
                fill="none"
                className="absolute inset-x-2 -inset-y-0.5 h-[calc(100%+4px)] w-[calc(100%-16px)] opacity-0 group-has-checked:opacity-100"
              >
                <path
                  d="M18 30 C 14 12, 60 4, 96 10 C 118 14, 116 38, 84 44 C 52 50, 12 44, 10 28 C 9 20, 22 13, 34 11"
                  stroke="#1d3f66"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength="1"
                  className="[stroke-dasharray:1] group-has-checked:animate-[ink-circle_450ms_ease-out] motion-reduce:animate-none"
                />
              </svg>
              <span className="relative">
                {value === customChoice
                  ? dict.custom
                  : interpolate(dict.amount, {
                      amount: Number(value).toLocaleString("ja-JP"),
                    })}
              </span>
            </label>
          ))}
        </div>
        {fieldError("choice") && (
          <p
            className="mt-1 text-center text-destructive-foreground text-xs"
            role="alert"
          >
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
      <p className="text-center text-[11px] text-paper-muted leading-5">
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
