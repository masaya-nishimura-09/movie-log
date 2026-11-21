import Link from "next/link";
import { Logo } from "@/components/atoms/logo";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function LegalLayout({
  children,
}: LayoutProps<"/[lang]">) {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <main className="flex-1 bg-background">
      <div className="app-container max-w-3xl py-8 md:py-12">
        <Link
          href={`/${lang}`}
          className="mb-8 inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo name={dict.brand.name} className="h-9 md:h-10" />
        </Link>
        {children}
      </div>
    </main>
  );
}
