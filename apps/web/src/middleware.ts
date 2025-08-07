import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Роуты, которые требуют авторизации
const protectedRoutes = [
  "/profile",
  "/profile/orders",
  "/profile/addresses",
  "/profile/favorites",
  "/profile/payment",
  "/profile/notifications",
  "/profile/settings",
];

// Роуты аутентификации (не должны быть доступны авторизованным пользователям)
const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Проверяем, является ли роут защищенным
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Проверяем, является ли роут аутентификации
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Если это защищенный роут и пользователь не авторизован
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Если это роут аутентификации и пользователь уже авторизован
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
