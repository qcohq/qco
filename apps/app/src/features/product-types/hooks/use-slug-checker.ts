import { useCallback, useState } from "react";
import { useTRPC } from "~/trpc/react";

interface SlugCheckResult {
  isUnique: boolean;
  message: string;
}

interface UseSlugCheckerProps {
  excludeId?: string;
}

export function useSlugChecker({ excludeId }: UseSlugCheckerProps = {}) {
  const trpc = useTRPC();
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SlugCheckResult | null>(null);

  const checkSlugUniqueness = useCallback(
    async (slug: string) => {
      if (!slug || slug.trim() === "") {
        setResult(null);
        return;
      }

      setIsChecking(true);
      setResult(null);

      try {
        const checkResult = await trpc.productTypes.checkSlugUniqueness.query({
          slug,
          excludeId,
        });
        setResult(checkResult);
        return checkResult;
      } catch (_error) {
        const errorResult = {
          isUnique: false,
          message: "Ошибка при проверке уникальности",
        };
        setResult(errorResult);
        return errorResult;
      } finally {
        setIsChecking(false);
      }
    },
    [trpc, excludeId],
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isChecking,
    result,
    checkSlugUniqueness,
    clearResult,
  };
}
