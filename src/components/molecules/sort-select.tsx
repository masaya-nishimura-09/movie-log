"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";

type SortOption = { value: string; label: string; href: string };

type SortSelectProps = {
  label: string;
  value: string;
  options: SortOption[];
};

export function SortSelect({ label, value, options }: SortSelectProps) {
  const router = useRouter();

  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        const option = options.find((o) => o.value === next);
        if (option) router.push(option.href, { scroll: false });
      }}
    >
      <SelectTrigger
        aria-label={label}
        size="sm"
        className="w-full bg-card text-[13px]"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
