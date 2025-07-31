"use client";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AuthLayout({
  children,
  title = "Панель администратора",
  description = "Войдите в систему для управления магазином",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-slate-600">{description}</p>
        </div>

        {children}

        <div className="text-center text-sm text-slate-500">
          <p>© 2025 QCO Admin Panel. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
}
