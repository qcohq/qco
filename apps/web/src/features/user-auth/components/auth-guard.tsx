"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../hooks/use-session";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { session, sessionLoading, isAuthenticated } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [sessionLoading, isAuthenticated, router]);

  // Показываем загрузку пока проверяем сессию
  if (sessionLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      )
    );
  }

  // Если не авторизован, не показываем контент (будет редирект)
  if (!isAuthenticated) {
    return null;
  }

  // Если авторизован, показываем защищенный контент
  return <>{children}</>;
}
