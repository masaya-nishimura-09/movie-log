import { z } from "zod";

export const supportPresetAmounts = [300, 500, 1000] as const;

export const supportMinAmount = 100;

export const supportMaxAmount = 10000;

export const customChoice = "custom";

const choices = [...supportPresetAmounts.map(String), customChoice] as const;

function normalizeAmount(value: string): string {
  return value.normalize("NFKC").replace(/[,\s]/g, "");
}

export const supportInputSchema = z
  .object({
    choice: z.enum(choices, "choiceRequired"),
    customAmount: z.string(),
  })
  .superRefine((input, ctx) => {
    if (input.choice !== customChoice) return;
    const value = normalizeAmount(input.customAmount);
    const amount = Number(value);
    const message =
      value === ""
        ? "customAmountRequired"
        : !/^\d+$/.test(value) ||
            amount < supportMinAmount ||
            amount > supportMaxAmount
          ? "customAmountOutOfRange"
          : undefined;
    if (message)
      ctx.addIssue({ code: "custom", path: ["customAmount"], message });
  })
  .transform((input) => ({
    amount: Number(
      input.choice === customChoice
        ? normalizeAmount(input.customAmount)
        : input.choice,
    ),
  }));

export type SupportInput = z.infer<typeof supportInputSchema>;
