"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useDebounce } from "@qco/ui/hooks/use-debounce";

/**
 * Стандартный формат ответа API с пагинацией
 */
export interface ApiResponse<T> {
  data: T[];
  pagination: {
    hasMore: boolean;
    total?: number;
  };
}

/**
 * Параметры для хука useTRPCSearchableData
 */
export interface UseTRPCSearchableDataOptions {
  /** Путь к процедуре в формате 'namespace.method' */
  procedure: string;
  /** Дополнительные параметры запроса */
  inputParams: Record<string, unknown>;
  /** Количество элементов на странице */
  limit?: number;
  /** Строка поиска */
  search?: string;
  /** Поля, по которым производится поиск */
  searchFields?: string[];
}

/**
 * Результат работы хука useTRPCSearchableData
 */
export interface UseTRPCSearchableDataResult<T> {
  /** Загруженные данные */
  data: T[];
  /** Флаг загрузки (включая первоначальную и последующие) */
  loading: boolean;
  /** Флаг первоначальной загрузки */
  initialLoading: boolean;
  /** Флаг активного запроса */
  isFetching: boolean;
  /** Сообщение об ошибке */
  error: string | null;
  /** Флаг наличия ошибки */
  isError: boolean;
  /** Флаг наличия дополнительных данных для загрузки */
  hasMore: boolean;
  /** Текущая страница */
  page: number;
  /** Функция для загрузки следующей страницы */
  loadMore: () => void;
  /** Функция для обновления данных */
  refresh: () => void;
}

/**
 * Тип для процедуры tRPC
 */
type TRPCProcedure<T> = {
  queryOptions: (params: Record<string, unknown>) => UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>;
  queryKey: (params: Record<string, unknown>) => QueryKey;
};

/**
 * Хук для работы с поисковыми запросами через tRPC с поддержкой пагинации и дебаунсинга
 * @template T Тип данных, возвращаемых API
 * @param options Параметры запроса
 * @returns Объект с данными, состоянием загрузки и функциями управления
 */
export function useTRPCSearchableData<T>({
  procedure,
  inputParams,
  limit = 20,
  search = "",
  searchFields = ["name"],
}: UseTRPCSearchableDataOptions): UseTRPCSearchableDataResult<T> {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);
  const activeElementRef = useRef<HTMLElement | null>(null);

  // Разбиваем строку процедуры на namespace и method
  const [namespace, method] = useMemo(() => {
    const parts = procedure.split(".");
    if (parts.length !== 2) {
      console.error("Неверный формат процедуры. Используйте формат 'namespace.method'");
      return ["", ""];
    }
    return parts as [string, string];
  }, [procedure]);

  // Сбрасываем данные при изменении поискового запроса
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearch]);

  // Сохраняем активный элемент перед запросом
  useEffect(() => {
    activeElementRef.current = document.activeElement as HTMLElement | null;
  }, []);

  // Создаем параметры запроса с помощью useMemo
  const queryParams = useMemo(() => ({
    ...inputParams,
    page,
    limit,
    search: debouncedSearch,
    searchFields: searchFields.join(","),
  }), [inputParams, page, limit, debouncedSearch, searchFields]);

  // Получаем процедуру tRPC
  const procedureObj = useMemo<TRPCProcedure<T> | undefined>(() => {
    if (!namespace || !method) return undefined;

    try {
      // @ts-ignore - Динамический доступ к tRPC роутеру
      const namespaceObj = trpc[namespace];
      if (!namespaceObj || typeof namespaceObj !== "object") return undefined;

      // @ts-ignore - Динамический доступ к методу
      const methodObj = namespaceObj[method];
      if (!methodObj || typeof methodObj !== "object") return undefined;

      // Проверяем наличие необходимых методов
      if (!('queryOptions' in methodObj) || !('queryKey' in methodObj)) return undefined;
      if (typeof methodObj.queryOptions !== 'function' || typeof methodObj.queryKey !== 'function') return undefined;

      return methodObj as TRPCProcedure<T>;
    } catch (err) {
      console.error(`Ошибка при получении процедуры ${procedure}:`, err);
      return undefined;
    }
  }, [trpc, namespace, method, procedure]);

  // Создаем опции запроса
  const queryOptions = useMemo(() => {
    if (!procedureObj) return undefined;

    try {
      return procedureObj.queryOptions(queryParams);
    } catch (err) {
      console.error(`Ошибка при создании опций запроса для ${procedure}:`, err);
      return undefined;
    }
  }, [procedureObj, queryParams, procedure]);

  // Создаем расширенные опции запроса
  const enhancedQueryOptions = useMemo<UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, QueryKey>>(() => {
    // Дефолтные опции с пустым результатом
    const emptyResponse: ApiResponse<T> = { 
      data: [], 
      pagination: { hasMore: false } 
    };
    
    const defaultOptions: UseQueryOptions<ApiResponse<T>, Error, ApiResponse<T>, QueryKey> = {
      queryKey: ["invalid", procedure],
      enabled: false,
      queryFn: () => Promise.resolve(emptyResponse),
      retry: false,
    };

    if (!queryOptions) return defaultOptions;

    return {
      ...queryOptions,
      enabled: Boolean(procedureObj),
      staleTime: 30000, // 30 секунд
      refetchOnWindowFocus: false,
      placeholderData: (prev: unknown) => prev as ApiResponse<T>, // Эквивалент keepPreviousData в v5
    };
  }, [queryOptions, procedureObj, procedure]);

  // Выполняем запрос с помощью useQuery
  const {
    data: result,
    isLoading,
    error,
    isPending,
    isFetching,
  } = useQuery(enhancedQueryOptions);

  // Обрабатываем результат при его изменении
  useEffect(() => {
    if (!result) return;

    try {
      // Безопасно извлекаем данные из результата
      const resultData = Array.isArray(result.data) ? result.data : [];
      
      // Обрабатываем результат
      setData((prev) => (page === 1 ? resultData : [...prev, ...resultData]));
      
      // Безопасно проверяем наличие флага hasMore
      const hasMorePages = result.pagination && typeof result.pagination === 'object' 
        ? Boolean(result.pagination.hasMore) 
        : false;
      setHasMore(hasMorePages);

      // Восстанавливаем фокус на активном элементе
      if (activeElementRef.current instanceof HTMLInputElement) {
        activeElementRef.current.focus();
      }
    } catch (err) {
      // Логируем ошибку обработки результата
      console.error('Ошибка при обработке результата запроса:', err);
      // Устанавливаем пустые данные и отключаем пагинацию
      setData([]);
      setHasMore(false);
    }
  }, [result, page]);

  // Функция для загрузки следующей страницы
  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // Создаем стабильную ссылку на queryKey
  const queryKey = useMemo(() => {
    if (!procedureObj) return ["invalid", procedure] as QueryKey;

    try {
      return procedureObj.queryKey({
        ...inputParams,
        limit,
        searchFields: searchFields.join(","),
      });
    } catch (err) {
      console.error(`Ошибка при создании queryKey для ${procedure}:`, err);
      return ["invalid", procedure] as QueryKey;
    }
  }, [procedureObj, inputParams, limit, searchFields, procedure]);

  // Функция для обновления данных
  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    // Используем void для игнорирования Promise
    void queryClient.invalidateQueries({
      queryKey,
    });
  }, [queryClient, queryKey]);

  // Формируем сообщение об ошибке
  const errorMessage = useMemo(() => {
    if (!error) return null;

    // Безопасная обработка ошибок
    try {
      // Проверяем тип ошибки
      if (error instanceof Error) {
        return error.message;
      }

      // Обработка объектов ошибок
      if (typeof error === 'object' && error !== null) {
        // Проверяем наличие поля message
        const errorObj = error as Record<string, unknown>;
        if ('message' in errorObj && typeof errorObj.message === 'string') {
          return errorObj.message;
        }

        // Проверяем наличие поля cause
        if ('cause' in errorObj &&
          typeof errorObj.cause === 'object' &&
          errorObj.cause !== null) {
          const cause = errorObj.cause as Record<string, unknown>;
          if ('message' in cause && typeof cause.message === 'string') {
            return cause.message;
          }
        }
      }

      // Обработка строковых ошибок
      if (typeof error === 'string') {
        return error;
      }

      // Если ничего не подошло
      return "Неизвестная ошибка";
    } catch {
      // Защита от любых ошибок при обработке ошибок
      return "Ошибка при обработке запроса";
    }
  }, [error]);

  return {
    data,
    loading: isPending,
    initialLoading: isLoading,
    isFetching,
    error: errorMessage,
    hasMore,
    loadMore,
    refresh,
    page,
    isError: Boolean(error),
  };
}
