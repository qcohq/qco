import type { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">{children}</div>
    </div>
  );
}
