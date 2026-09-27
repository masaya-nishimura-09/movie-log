import { BottomNav } from "@/components/organisms/bottom-nav";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function TabsLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <>
      <div className="flex flex-1 flex-col pb-17 md:pb-0">{children}</div>
      <BottomNav lang={lang} dict={dict.bottomNav} />
    </>
  );
}
