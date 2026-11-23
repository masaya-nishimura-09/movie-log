import type { ComponentProps, ReactNode } from "react";
import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { LetterPaper } from "@/components/molecules/desk-items";
import { ContactForm } from "@/components/organisms/contact-form";

type ContactDeskProps = Omit<
  ComponentProps<typeof ContactForm>,
  "appearance"
> & {
  footer: ReactNode;
};

export function ContactDesk({ footer, ...form }: ContactDeskProps) {
  return (
    <div className="flex w-full max-w-80 flex-col lg:max-w-lg">
      <LetterPaper>
        <div className="flex justify-center pt-1">
          <BrandShape
            shapes={wordmarkShapes}
            ringClassName="fill-(--logo-ring)"
            glyphClassName="fill-paper-ink"
            className="h-8 w-auto"
          />
        </div>
        <ContactForm {...form} appearance="postcard" />
      </LetterPaper>
      <div className="mt-6 flex justify-center gap-2.5">{footer}</div>
    </div>
  );
}
