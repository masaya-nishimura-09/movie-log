import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { cn } from "@/lib/style/cn";

type LegalSection = { h: string; p: string[] };

type LegalDocumentProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  updatedLabel: string;
  updated: string;
  contactLabel: string;
  contactHref: string;
  backLabel: string;
  backHref: string;
};

export function LegalDocument({
  title,
  intro,
  sections,
  updatedLabel,
  updated,
  contactLabel,
  contactHref,
  backLabel,
  backHref,
}: LegalDocumentProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl text-foreground">{title}</h1>
        <p className="text-muted-foreground text-xs">
          {updatedLabel}: {updated}
        </p>
      </header>
      <p className="text-[13px] text-foreground-sub leading-relaxed">{intro}</p>
      {sections.map((section, index) => (
        <section key={section.h} className="flex flex-col gap-2">
          <h2 className="font-bold text-base text-foreground">{section.h}</h2>
          {section.p.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[13px] text-foreground-sub leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
          {index === sections.length - 1 && (
            <Link
              href={contactHref}
              className="self-start font-medium text-[13px] text-primary underline-offset-4 hover:underline"
            >
              {contactLabel}
            </Link>
          )}
        </section>
      ))}
      <Link
        href={backHref}
        className={cn(buttonVariants({ variant: "outline" }), "self-center")}
      >
        <ArrowLeft aria-hidden />
        {backLabel}
      </Link>
    </article>
  );
}
