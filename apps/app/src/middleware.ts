import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const publicRoutes = ["/login", "/admin-invitation", "/reset-password"];
  const isPublicRoute = publicRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  const sessionCookie = getSessionCookie(req);

  // Если это auth-страница и пользователь уже авторизован, перенаправляем на главную
  if (isPublicRoute && sessionCookie) {
    const dashboardUrl = new URL("/", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Если это не публичная страница и пользователь не авторизован, перенаправляем на логин
  if (!isPublicRoute && !sessionCookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
