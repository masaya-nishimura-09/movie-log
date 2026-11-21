import { CircleAlert, CircleCheck, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { phrases } from "@/components/atoms/phrases";
import { cn } from "@/lib/style/cn";

const icons = {
  mail: Mail,
  done: CircleCheck,
  failed: CircleAlert,
};

type ResultMessageProps = {
  icon: keyof typeof icons;
  title: string;
  text: ReactNode;
  note?: string;
};

export function ResultMessage({ icon, title, text, note }: ResultMessageProps) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-start">
      <span
        className={cn(
          "grid size-14 place-items-center rounded-full",
          icon === "failed"
            ? "bg-destructive/10 text-destructive-foreground"
            : "bg-[rgb(139_94_60/0.12)] text-paper-label",
        )}
      >
        <Icon className="size-6.5" strokeWidth={1.6} aria-hidden />
      </span>
      <h1 className="font-bold font-display text-foreground text-lg leading-7">
        {phrases(title)}
      </h1>
      <output className="text-[13px] text-foreground-sub leading-7">
        {typeof text === "string" ? phrases(text) : text}
      </output>
      {note && (
        <p className="text-[13px] text-foreground-sub leading-7">
          {phrases(note)}
        </p>
      )}
    </div>
  );
}
