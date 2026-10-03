"use client";

import { LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms/sidebar";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type AppSidebarProps = {
  lang: Locale;
  dict: Dictionary["bottomNav"];
};

export function AppSidebar({ lang, dict }: AppSidebarProps) {
  const pathname = usePathname();
  const recordsHref = `/${lang}/records`;
  const newHref = `/${lang}/records/new`;
  const onNew = pathname === newHref;

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarContent>
        <SidebarGroup className="gap-3">
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={newHref} />}
                tooltip={dict.newRecord}
                className="h-11 rounded-xl bg-primary font-bold text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
                isActive={onNew}
              >
                <Plus />
                <span>{dict.newRecord}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href={recordsHref} />}
                tooltip={dict.records}
                isActive={pathname.startsWith(recordsHref) && !onNew}
                className="h-10 rounded-full px-3 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
              >
                <LayoutGrid />
                <span>{dict.records}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
