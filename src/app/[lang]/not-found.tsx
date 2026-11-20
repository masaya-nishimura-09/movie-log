import Link from "next/link";
import { buttonVariants } from "@/components/atoms/button";
import { phrases } from "@/components/atoms/phrases";
import { CoverScreen } from "@/components/organisms/cover-screen";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

export default async function NotFound() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <CoverScreen homeHref={`/${lang}`} brandName={dict.brand.name}>
      <p
        aria-hidden="true"
        className="font-bold font-display text-[44px] text-primary leading-14"
      >
        404
      </p>
      <h1 className="font-bold font-display text-lg leading-7">
        {dict.notFound.title}
      </h1>
      <p className="mt-3.5 text-[13px] text-foreground-sub leading-7">
        {phrases(dict.notFound.description)}
      </p>
      <Link
        href={`/${lang}/records`}
        className={cn(buttonVariants(), "mt-3.5 w-full")}
      >
        {dict.notFound.action}
      </Link>
    </CoverScreen>
  );
}
