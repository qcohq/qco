import { Toaster } from "@qco/ui/components/sonner";
import { cn } from "@qco/ui/lib/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import "@qco/ui/globals.css";

import { env } from "~/env";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://app.qco.me"
      : "http://localhost:3000",
  ),
  title: "QCO AI",
  description: "AI-powered platform for quantum computing optimization",
  openGraph: {
    title: "QCO AI",
    description: "AI-powered platform for quantum computing optimization",
    url: "https://app.qco.me",
    siteName: "QCO AI",
  },
  twitter: {
    card: "summary_large_image",
    site: "@qcoai",
    creator: "@qcoai",
  },
};

export const viewport: Viewport = {
  themeColor: "white",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased overflow-hidden",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Providers>
          {props.children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
