import { useEffect, useState } from "react";

interface AuthProviders {
  google: boolean;
}

export function useAuthProviders() {
  const [providers, setProviders] = useState<AuthProviders | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers");
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders({ google: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, isLoading };
}
