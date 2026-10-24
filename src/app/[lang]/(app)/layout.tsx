import { getCurrentUser } from "@/api/user/get-current-user";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { AppTopBar } from "@/components/organisms/app-top-bar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AppLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict, user] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
  ]);

  return (
    <div className="shell flex min-h-svh w-full flex-col bg-sidebar [--header-height:--spacing(15)] md:[--header-height:--spacing(18)]">
      <AppTopBar
        lang={lang}
        brandName={dict.brand.name}
        username={user.username}
        dict={dict.header}
        navDict={dict.nav}
      />
      <div className="flex min-h-0 flex-1">
        <AppSidebar lang={lang} dict={dict.nav} linkDict={dict.header} />
        <main className="shell-inset relative mx-2 mb-[calc(0.5rem+env(safe-area-inset-bottom))] flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl bg-background md:mr-7 md:mb-7 md:ml-0 md:h-[calc(100svh-var(--header-height)-1.75rem)] md:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
