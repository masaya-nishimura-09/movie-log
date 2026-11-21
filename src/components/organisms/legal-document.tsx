import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NotebookHeading } from "@/components/atoms/notebook-heading";
import { phrases } from "@/components/atoms/phrases";
import { TextLink } from "@/components/atoms/text-link";

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
    <article className="flex flex-col">
      <header>
        <h1 className="font-bold font-display text-foreground text-lg leading-7">
          {title}
        </h1>
        <p className="text-muted-foreground text-xs leading-7">
          {updatedLabel}: {updated}
        </p>
      </header>
      <p className="mt-7 text-[13px] text-foreground-sub leading-7">
        {phrases(intro)}
      </p>
      {sections.map((section, index) => (
        <section key={section.h} className="mt-7">
          <NotebookHeading className="text-foreground">
            {phrases(section.h)}
          </NotebookHeading>
          {section.p.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[13px] text-foreground-sub leading-7"
            >
              {phrases(paragraph)}
            </p>
          ))}
          {index === sections.length - 1 && (
            <TextLink href={contactHref} className="text-[13px] leading-7">
              {contactLabel}
            </TextLink>
          )}
        </section>
      ))}
      <Link
        href={backHref}
        className="mt-7 inline-flex h-7 items-center gap-1.5 self-start rounded-sm text-[13px] text-foreground outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {backLabel}
      </Link>
    </article>
  );
}
