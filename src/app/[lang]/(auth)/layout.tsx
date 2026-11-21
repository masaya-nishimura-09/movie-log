import { CoverScreen } from "@/components/organisms/cover-screen";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AuthLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <CoverScreen homeHref={`/${lang}`} brandName={dict.brand.name}>
      {children}
    </CoverScreen>
  );
}
