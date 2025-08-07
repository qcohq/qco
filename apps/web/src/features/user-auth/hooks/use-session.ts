import { authClient } from "@qco/web-auth/client";

export function useSession() {
  const {
    data: session,
    isPending: sessionLoading,
    error: sessionError,
  } = authClient.useSession();

  return {
    session,
    sessionLoading,
    sessionError,
    isAuthenticated: !!session?.user,
  };
}
