import Link from "next/link";
import { contactFormUrl } from "@/lib/legal/contact";

type LegalSection = { h: string; p: string[] };

type LegalDocumentProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  updatedLabel: string;
  updated: string;
  contactLabel: string;
  contactPending: string;
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
  contactPending,
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
          {index === sections.length - 1 &&
            (contactFormUrl === "" ? (
              <p className="text-[13px] text-foreground-sub">
                {contactLabel}: {contactPending}
              </p>
            ) : (
              <a
                href={contactFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-start text-[13px] text-primary underline-offset-4 hover:underline"
              >
                {contactLabel}
              </a>
            ))}
        </section>
      ))}
      <Link
        href={backHref}
        className="self-center rounded-sm text-primary text-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        {backLabel}
      </Link>
    </article>
  );
}
