import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QCO - Роскошный универмаг",
  description:
    "Эксклюзивная коллекция одежды, обуви, аксессуаров и косметики от ведущих мировых брендов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
