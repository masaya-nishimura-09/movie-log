"use client";

import { MinusCircle, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { type CreditRole, creditRoleSchema } from "@/schemas/record/enums";
import type { Credit } from "@/schemas/record/record";

type Row = Credit & { key: string };

type CreditRowsProps = {
  defaultValue: Credit[];
  roleLabels: Record<CreditRole, string>;
  roleLabel: string;
  namePlaceholder: string;
  addLabel: string;
  removeLabel: string;
};

export function CreditRows({
  defaultValue,
  roleLabels,
  roleLabel,
  namePlaceholder,
  addLabel,
  removeLabel,
}: CreditRowsProps) {
  const [rows, setRows] = useState<Row[]>(() =>
    (defaultValue.length > 0
      ? defaultValue
      : [{ creditRole: "director" as const, personName: "" }]
    ).map((credit, index) => ({ ...credit, key: `initial-${index}` })),
  );
  const items = creditRoleSchema.options.map((role) => ({
    value: role,
    label: roleLabels[role],
  }));

  function update(key: string, patch: Partial<Credit>) {
    setRows(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const creditRole = rows.at(-1)?.creditRole ?? "director";
    setRows([
      ...rows,
      { key: crypto.randomUUID(), creditRole, personName: "" },
    ]);
  }

  return (
    <div className="@container flex flex-col gap-2">
      {rows.map((row, index) => (
        <div
          key={row.key}
          className="flex flex-wrap @md:flex-nowrap items-center gap-2"
        >
          <Select
            name={`credits.${index}.creditRole`}
            items={items}
            value={row.creditRole}
            onValueChange={(value) => {
              const parsed = creditRoleSchema.safeParse(value);
              if (parsed.success) update(row.key, { creditRole: parsed.data });
            }}
          >
            <SelectTrigger
              aria-label={roleLabel}
              className="order-1 w-32 shrink-0"
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
          <Input
            name={`credits.${index}.personName`}
            value={row.personName}
            maxLength={100}
            className="@md:order-2 order-3 @md:flex-1 @md:basis-0 basis-full"
            placeholder={namePlaceholder}
            onChange={(event) =>
              update(row.key, { personName: event.target.value })
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={removeLabel}
            onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
            className="@md:order-3 order-2 @md:ml-0 ml-auto shrink-0 text-muted-foreground"
          >
            <MinusCircle aria-hidden />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addRow}
        className="self-start text-primary"
      >
        <Plus aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}
