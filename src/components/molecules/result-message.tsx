import { CircleAlert, CircleCheck, MailCheck } from "lucide-react";
import { phrases } from "@/components/atoms/phrases";

const icons = {
  mail: <MailCheck className="mb-1 size-10 text-link" aria-hidden />,
  done: <CircleCheck className="mb-1 size-10 text-link" aria-hidden />,
  failed: (
    <CircleAlert
      className="mb-1 size-10 text-destructive-foreground"
      aria-hidden
    />
  ),
};

type ResultMessageProps = {
  icon: keyof typeof icons;
  title: string;
  text: string;
};

export function ResultMessage({ icon, title, text }: ResultMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icons[icon]}
      <h1 className="font-bold text-foreground text-xl">{phrases(title)}</h1>
      <output className="text-balance text-[13px] text-foreground-sub leading-relaxed">
        {phrases(text)}
      </output>
    </div>
  );
}
