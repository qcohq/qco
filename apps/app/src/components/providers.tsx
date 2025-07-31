"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </NextThemesProvider>
  );
}
