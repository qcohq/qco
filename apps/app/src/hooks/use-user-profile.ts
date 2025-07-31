import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export function useUserProfile() {
  const trpc = useTRPC();

  const profileQueryOptions = trpc.auth.getProfile.queryOptions(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: profile,
    isPending: profileLoading,
    error: profileError,
  } = useQuery(profileQueryOptions);

  return {
    profile,
    profileLoading,
    profileError,
    isAuthenticated: !!profile,
  };
}
