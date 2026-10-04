import { cookies } from "next/headers";
import { getCurrentUser } from "@/api/user/get-current-user";
import { AppSidebar } from "@/components/organisms/app-sidebar";
import { AppTopBar } from "@/components/organisms/app-top-bar";
import { BottomNav } from "@/components/organisms/bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/organisms/sidebar";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function AppLayout({ children }: LayoutProps<"/[lang]">) {
  const [lang, dict, user, cookieStore] = await Promise.all([
    getLocale(),
    getDictionary(),
    getCurrentUser(),
    cookies(),
  ]);
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="shell flex-col bg-sidebar [--header-height:--spacing(15)]"
    >
      <AppTopBar
        lang={lang}
        brandName={dict.brand.name}
        username={user.username}
        dict={dict.header}
      />
      <div className="flex flex-1">
        <AppSidebar lang={lang} dict={dict.bottomNav} />
        <SidebarInset className="shell-inset mx-2 mb-[calc(4.75rem+env(safe-area-inset-bottom))] min-w-0 rounded-2xl md:mb-2 md:h-[calc(100svh-var(--header-height)-1rem)] md:overflow-y-auto">
          {children}
        </SidebarInset>
      </div>
      <BottomNav lang={lang} dict={dict.bottomNav} />
    </SidebarProvider>
  );
}
