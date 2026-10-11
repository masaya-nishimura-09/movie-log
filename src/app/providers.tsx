"use client";

import { Toast } from "@base-ui/react/toast";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { type ComponentProps, useEffect } from "react";
import { Toaster } from "@/components/molecules/toaster";
import { recordVisit } from "@/lib/navigation/in-app-history";

function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);
  return null;
}

export function Providers({
  children,
  ...props
}: ComponentProps<typeof ThemeProvider>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <Toast.Provider timeout={4000}>
        <NavigationTracker />
        {children}
        <Toaster />
      </Toast.Provider>
    </ThemeProvider>
  );
}
