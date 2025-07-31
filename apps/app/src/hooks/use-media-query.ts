"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create handler function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    media.addEventListener("change", listener);

    // Clean up listener on unmount
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
