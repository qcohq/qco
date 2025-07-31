import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "~/trpc/react";

interface UseSlugValidationProps {
  slug: string;
  excludeId?: string; // ID товара для исключения при редактировании
  enabled?: boolean; // Включать ли проверку
  debounceMs?: number; // Задержка в миллисекундах
}

interface SlugValidationResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  existingProduct: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export function useSlugValidation({
  slug,
  excludeId,
  enabled = true,
  debounceMs = 500,
}: UseSlugValidationProps): SlugValidationResult {
  const [debouncedSlug, setDebouncedSlug] = useState(slug || "");
  const trpc = useTRPC();

  // Дебаунс для slug
  useEffect(() => {
    if (!enabled || !slug || slug.trim().length < 2) {
      setDebouncedSlug("");
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSlug(slug.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [slug, enabled, debounceMs]);

  // Опции для запроса проверки слага
  const slugCheckOptions = trpc.products.checkSlug.queryOptions({
    slug: debouncedSlug,
    excludeId,
  });

  // Выполняем запрос только если есть slug для проверки
  const shouldCheck = Boolean(
    enabled && debouncedSlug && debouncedSlug.length >= 2,
  );

  const {
    data: checkData,
    isPending: isChecking,
    error: checkError,
  } = useQuery({
    ...slugCheckOptions,
    enabled: shouldCheck,
  });

  return {
    isChecking,
    isAvailable: shouldCheck ? (checkData?.isAvailable ?? null) : null,
    error: checkError?.message || null,
    existingProduct: checkData?.existingProduct || null,
  };
}
