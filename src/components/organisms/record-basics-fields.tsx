"use client";

import { useState } from "react";
import { ChoiceChip } from "@/components/atoms/choice-chip";
import { Input } from "@/components/atoms/input";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import { toDateInputValue } from "@/lib/date/format-date";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { type Platform, platformSchema, scores } from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordBasicsFieldsProps = {
  values: RecordFormValues;
  frequentPlatforms: Platform[];
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
};

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toDateInputValue(date);
}

export function RecordBasicsFields({
  values,
  frequentPlatforms,
  dict,
  enums,
  counterTemplate,
}: RecordBasicsFieldsProps) {
  const [watchedAt, setWatchedAt] = useState(values.watchedAt);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const pinned =
    values.platform && !frequentPlatforms.includes(values.platform)
      ? [...frequentPlatforms, values.platform]
      : frequentPlatforms;
  const platforms = showAllPlatforms
    ? [...pinned, ...platformSchema.options.filter((p) => !pinned.includes(p))]
    : pinned;
  const quickDates = [
    { label: dict.today, value: daysAgo(0) },
    { label: dict.yesterday, value: daysAgo(1) },
  ];

  return (
    <div className="flex flex-col gap-4.5">
      <FormField
        label={dict.title}
        htmlFor="title"
        required
        requiredLabel={dict.required}
      >
        <CountedInput
          id="title"
          name="title"
          required
          maxLength={255}
          defaultValue={values.title}
          counterTemplate={counterTemplate}
        />
      </FormField>

      <div className="grid gap-4.5 md:grid-cols-2 md:gap-4">
        <FormField
          label={dict.watchedAt}
          htmlFor="watchedAt"
          required
          requiredLabel={dict.required}
        >
          <Input
            id="watchedAt"
            name="watchedAt"
            type="date"
            required
            value={watchedAt}
            onChange={(event) => setWatchedAt(event.target.value)}
            className="tabular-nums"
          />
          <div className="mt-0.75 flex gap-1.5">
            {quickDates.map((quick) => (
              <button
                key={quick.label}
                type="button"
                onClick={() => setWatchedAt(quick.value)}
                className={cn(
                  "rounded-full px-2.75 py-1.25 text-xs",
                  watchedAt === quick.value
                    ? "bg-selected text-selected-foreground"
                    : "bg-secondary text-foreground-sub hover:text-foreground",
                )}
              >
                {quick.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          label={dict.score}
          required
          requiredLabel={dict.required}
          hint={dict.scoreHint}
        >
          <div
            className="flex gap-1.75"
            role="radiogroup"
            aria-label={dict.score}
          >
            {scores.toReversed().map((score) => (
              <ChoiceChip
                key={score}
                type="radio"
                name="score"
                value={score}
                required
                defaultChecked={values.score === score}
                shape="block"
                size="lg"
                tone="field"
                className="h-13 md:h-11"
              >
                {score}
              </ChoiceChip>
            ))}
          </div>
        </FormField>
      </div>

      <FormField
        label={dict.platform}
        required
        requiredLabel={dict.required}
        hint={dict.platformHint}
      >
        <div
          className="flex flex-wrap gap-1.75"
          role="radiogroup"
          aria-label={dict.platform}
        >
          {platforms.map((platform) => (
            <ChoiceChip
              key={platform}
              type="radio"
              name="platform"
              value={platform}
              required
              defaultChecked={values.platform === platform}
              className="h-10 md:h-9.5"
            >
              {enums.platform[platform]}
            </ChoiceChip>
          ))}
          <button
            type="button"
            onClick={() => setShowAllPlatforms(!showAllPlatforms)}
            className="h-10 rounded-full border border-dash-line border-dashed px-3.25 text-[13px] text-foreground-sub hover:text-foreground md:h-9.5"
          >
            {showAllPlatforms
              ? dict.fewerPlatforms
              : interpolate(dict.morePlatforms, {
                  count: platformSchema.options.length,
                })}
          </button>
        </div>
      </FormField>
    </div>
  );
}
