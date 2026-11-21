import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { ResultMessage } from "@/components/molecules/result-message";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.withdrawn.title, robots: { index: false } };
}

export default async function WithdrawnPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-7">
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
