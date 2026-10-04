"use client";

import { Toast } from "@base-ui/react/toast";
import { ThemeProvider } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster } from "@/components/molecules/toaster";

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
        {children}
        <Toaster />
      </Toast.Provider>
    </ThemeProvider>
  );
}
