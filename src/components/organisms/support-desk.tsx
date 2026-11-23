import type { ReactNode } from "react";
import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { phrases } from "@/components/atoms/phrases";
import { SupportForm } from "@/components/organisms/support-form";
import type { Dictionary } from "@/i18n/get-dictionary";

type SupportDeskProps = {
  action: Parameters<typeof SupportForm>[0]["action"];
  dict: Dictionary["support"];
  notes: ReactNode;
  footer: ReactNode;
};

export function SupportDesk({ action, dict, notes, footer }: SupportDeskProps) {
  return (
    <div className="flex w-full max-w-80 flex-col">
      <div className="paper-theme relative z-1 rounded-md bg-paper px-5.5 pt-6 pb-5 text-center text-paper-ink shadow-[0_14px_30px_rgb(10_41_71/0.22)]">
        <div className="flex justify-center">
          <BrandShape
            shapes={wordmarkShapes}
            ringClassName="fill-(--logo-ring)"
            glyphClassName="fill-paper-ink"
            className="h-8 w-auto"
          />
        </div>
        <h1 className="mt-4 text-center font-bold font-display text-lg leading-7">
          {dict.title}
        </h1>
        <div className="mt-1 text-[12px] text-paper-muted leading-5">
          <p>{phrases(dict.intro)}</p>
          <p>{phrases(dict.introRequest)}</p>
        </div>
        <SupportForm action={action} dict={dict} />
        {notes}
      </div>
      <div className="mt-6 flex justify-center">{footer}</div>
    </div>
  );
}
