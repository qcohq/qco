"use client";

import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {title && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
