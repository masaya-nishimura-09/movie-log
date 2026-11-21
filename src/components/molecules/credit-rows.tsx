"use client";

import { ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { NotebookInput } from "@/components/atoms/notebook-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { interpolate } from "@/lib/text/interpolate";
import { type CreditRole, creditRoleSchema } from "@/schemas/record/enums";
import type { Credit } from "@/schemas/record/record";

type Row = Credit & { key: string };

const inlineCount = 4;

type CreditRowsProps = {
  defaultValue: Credit[];
  roleLabels: Record<CreditRole, string>;
  invalid?: boolean;
  dict: {
    creditRole: string;
    personName: string;
    addCredit: string;
    removeCredit: string;
    moreCredits: string;
    creditsTitle: string;
    creditCount: string;
    done: string;
    close: string;
  };
};

export function CreditRows({
  defaultValue,
  roleLabels,
  invalid = false,
  dict,
}: CreditRowsProps) {
  const [rows, setRows] = useState<Row[]>(() =>
    defaultValue.map((credit, index) => ({
      ...credit,
      key: `initial-${index}`,
    })),
  );
  const [open, setOpen] = useState(false);
  const items = creditRoleSchema.options.map((role) => ({
    value: role,
    label: roleLabels[role],
  }));
  const hidden = rows.slice(inlineCount);
  const hiddenRoles = [
    ...new Set(hidden.map((row) => roleLabels[row.creditRole])),
  ].join("・");

  function update(key: string, patch: Partial<Credit>) {
    setRows(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const creditRole = rows.at(-1)?.creditRole ?? "director";
    setRows([
      ...rows,
      { key: crypto.randomUUID(), creditRole, personName: "" },
    ]);
    if (rows.length >= inlineCount) setOpen(true);
  }

  const renderRow = (row: Row, index: number) => (
    <div key={row.key} className="flex items-center gap-1.5 lg:gap-2">
      <Select
        items={items}
        value={row.creditRole}
        onValueChange={(value) => {
          const parsed = creditRoleSchema.safeParse(value);
          if (parsed.success) update(row.key, { creditRole: parsed.data });
        }}
      >
        <SelectTrigger
          aria-label={dict.creditRole}
          size="sm"
          className="h-6 w-17 shrink-0 rounded-md bg-[rgb(10_41_71/0.06)] px-2 font-normal text-[11px] text-paper-ink data-[size=sm]:h-6 lg:w-20.5 lg:text-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <NotebookInput
        value={row.personName}
        maxLength={100}
        placeholder={dict.personName}
        aria-label={dict.personName}
        aria-invalid={invalid || undefined}
        data-field={index === 0 ? "credits" : undefined}
        onChange={(event) =>
          update(row.key, { personName: event.target.value })
        }
      />
      <button
        type="button"
        aria-label={dict.removeCredit}
        onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
        className="grid size-6 shrink-0 place-items-center rounded-md text-paper-muted outline-none hover:bg-[rgb(10_41_71/0.06)] focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-3" aria-hidden />
      </button>
    </div>
  );

  const addButton = (
    <button
      type="button"
      onClick={addRow}
      className="inline-flex h-7 items-center gap-1 rounded-sm font-semibold text-[11px] text-paper-label outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring lg:text-xs"
    >
      <Plus className="size-3.5" aria-hidden />
      {dict.addCredit}
    </button>
  );

  return (
    <div>
      {rows.map((row, index) => (
        <span key={row.key}>
          <input
            type="hidden"
            name={`credits.${index}.creditRole`}
            value={row.creditRole}
          />
          <input
            type="hidden"
            name={`credits.${index}.personName`}
            value={row.personName}
          />
        </span>
      ))}
      {rows.slice(0, inlineCount).map(renderRow)}
      {hidden.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex h-7 w-full items-center justify-between border-[rgb(10_41_71/0.2)] border-b border-dashed px-0.5 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring lg:text-[13px]">
            {interpolate(dict.moreCredits, {
              count: hidden.length,
              roles: hiddenRoles,
            })}
            <ChevronRight className="size-3.5 shrink-0" aria-hidden />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="max-h-[70dvh] w-[min(34rem,calc(100vw-2rem))] gap-0 rounded-[14px] bg-[#fffdf8] p-4.5 text-paper-ink shadow-[0_18px_40px_rgb(10_41_71/0.22),0_0_0_1px_rgb(10_41_71/0.06)] ring-0"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold text-[15px]">
                {dict.creditsTitle}
                <span className="ml-1.5 font-normal text-paper-muted text-xs">
                  {interpolate(dict.creditCount, { count: rows.length })}
                </span>
              </p>
              <button
                type="button"
                aria-label={dict.close}
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-lg outline-none hover:bg-[rgb(10_41_71/0.06)] focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 overflow-y-auto">
              {rows.map(renderRow)}
            </div>
            <div className="mt-3 flex items-center justify-between">
              {addButton}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-[10px] bg-(--navy) px-3.5 font-semibold text-(--beige) text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {dict.done}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      {addButton}
    </div>
  );
}
