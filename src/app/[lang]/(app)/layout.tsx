import { getCurrentUser } from "@/api/user/get-current-user";
import { AppTopBar } from "@/components/organisms/app-top-bar";
import { BottomNav } from "@/components/organisms/bottom-nav";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AppLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict, user] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
  ]);

  return (
    <div className="shell flex min-h-svh w-full flex-col bg-sidebar [--header-height:--spacing(15)]">
      <AppTopBar
        lang={lang}
        brandName={dict.brand.name}
        username={user.username}
        newRecordLabel={dict.bottomNav.newRecord}
        dict={dict.header}
      />
      <main className="shell-inset relative mx-2 mb-[calc(4.75rem+env(safe-area-inset-bottom))] flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl bg-background md:mb-2 md:h-[calc(100svh-var(--header-height)-1rem)] md:flex-none md:overflow-y-auto">
        {children}
      </main>
      <BottomNav lang={lang} dict={dict.bottomNav} />
    </div>
  );
}
