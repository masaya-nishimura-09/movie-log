import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { Logo } from "@/components/atoms/logo";
import { ResultMessage } from "@/components/molecules/result-message";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.withdrawn.title, robots: { index: false } };
}

export default async function WithdrawnPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <Logo name={dict.brand.name} className="h-18" />
      </div>
      <ResultMessage
        icon="done"
        title={dict.withdrawn.title}
        text={dict.withdrawn.text}
      />
      <Link
        href={`/${lang}`}
        className={buttonVariants({ size: "lg", className: "w-full" })}
      >
        {dict.withdrawn.toTop}
      </Link>
    </div>
  );
}
