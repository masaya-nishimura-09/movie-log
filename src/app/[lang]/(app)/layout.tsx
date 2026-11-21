import { getCurrentUser } from "@/api/user/get-current-user";
import { AppTopBar } from "@/components/organisms/app-top-bar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AppLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict, user] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
  ]);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background [--app-header-height:57px] md:[--app-header-height:65px]">
      <AppTopBar
        lang={lang}
        brandName={dict.brand.name}
        username={user.username}
        dict={dict.header}
      />
      <main className="relative flex min-w-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
        {children}
      </main>
    </div>
  );
}
