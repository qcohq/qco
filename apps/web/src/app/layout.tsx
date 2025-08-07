import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type React from "react";
import "@qco/ui/globals.css";
import { Toaster } from "@qco/ui/components/sonner";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import PWAProvider from "@/components/pwa/pwa-provider";
import { TRPCReactProvider } from "@/trpc/react";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Eleganter - Роскошный универмаг",
  description:
    "Эксклюзивная коллекция одежды, обуви, аксессуаров и косметики от ведущих мировых брендов",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eleganter",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${manrope.variable}`} lang="ru">
      <body className={`${manrope.className} pb-20 md:pb-0`}>
        <TRPCReactProvider>
          <Header />
          <div className="mx-auto max-w-[1168px]">
            {children}
          </div>
          <Footer />
          <MobileBottomNav />
        </TRPCReactProvider>
        <Toaster />
        <PWAProvider />
      </body>
    </html>
  );
}
