"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { cn } from "@/lib/style/cn";

type SortOption = { value: string; label: string; href: string };

type SortSelectProps = {
  label: string;
  value: string;
  options: SortOption[];
  className?: string;
};

export function SortSelect({
  label,
  value,
  options,
  className,
}: SortSelectProps) {
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
        className={cn("w-full text-[13px]", className)}
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
