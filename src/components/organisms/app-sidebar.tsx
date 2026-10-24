import { AppNav, type AppNavProps } from "@/components/organisms/app-nav";

export function AppSidebar(props: AppNavProps) {
  return (
    <AppNav
      {...props}
      layout="responsive"
      className="hidden w-20 shrink-0 px-2 pb-7 md:flex lg:w-60 lg:px-4"
    />
  );
}
