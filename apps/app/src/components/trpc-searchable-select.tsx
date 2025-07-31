"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { ScrollArea } from "@qco/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { useIntersectionObserver } from "@qco/ui/hooks/use-intersection-observer";
import { cn } from "@qco/ui/lib/utils";
import { AlertCircle, Check, Loader2, RefreshCw, Search } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTRPCSearchableData } from "~/hooks/use-trpc-searchable-data";

// Базовый тип для элементов выбора
type SelectableItem = Record<string, unknown>;

interface TRPCSearchableSelectProps<T extends SelectableItem> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  procedure: string; // Например: "brands.getAll"
  inputParams?: Record<string, unknown>; // Дополнительные параметры для запроса
  searchFields: string[];
  displayField: keyof T & string;
  valueField: keyof T & string;
  renderItem?: (item: T) => React.ReactNode;
  renderSelectedItem?: (item: T) => React.ReactNode;
  limit?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  errorRetryMessage?: string;
}

export function TRPCSearchableSelect<T extends SelectableItem>({
  value,
  onValueChange,
  placeholder = "Поиск и выбор...",
  className,
  procedure,
  inputParams = {},
  searchFields,
  displayField,
  valueField,
  renderItem,
  renderSelectedItem,
  limit = 20,
  emptyMessage = "Ничего не найдено.",
  loadingMessage = "Загрузка...",
  errorRetryMessage = "Повторить",
}: TRPCSearchableSelectProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, initialLoading, error, hasMore, loadMore, refresh } =
    useTRPCSearchableData<T>({
      procedure,
      inputParams,
      limit,
      search: searchQuery,
      searchFields,
    });

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Загружаем больше данных при прокрутке
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  // Находим выбранный элемент
  useEffect(() => {
    if (value) {
      const item = data.find((item) => String(item[valueField]) === value);
      if (item) {
        setSelectedItem(item);
      }
    } else {
      setSelectedItem(null);
    }
  }, [value, data, valueField]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      // Обеспечиваем фокус на поле ввода
      e.target.focus();
    },
    [],
  );

  const handleValueChange = useCallback(
    (newValue: string) => {
      onValueChange?.(newValue);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onValueChange],
  );

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Используем setTimeout для фокусировки после рендеринга DOM
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setSearchQuery("");
    }
  }, []);

  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  const defaultRenderItem = useCallback(
    (item: T) => (
      <div className="flex items-center justify-between w-full">
        <span className="truncate">{String(item[displayField])}</span>
        {value === String(item[valueField]) && (
          <Check className="h-4 w-4 ml-2 opacity-50 shrink-0" />
        )}
      </div>
    ),
    [displayField, valueField, value],
  );

  const defaultRenderSelectedItem = useCallback(
    (item: T) => <span className="truncate">{String(item[displayField])}</span>,
    [displayField],
  );

  // Поддерживаем фокус на поле поиска
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder}>
          {selectedItem
            ? renderSelectedItem
              ? renderSelectedItem(selectedItem)
              : defaultRenderSelectedItem(selectedItem)
            : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-full">
        <div className="flex items-center border-b px-3 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={`Поиск ${searchFields.join(", ")}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            ref={searchInputRef}
          />
        </div>

        <ScrollArea className="h-[300px]">
          {error ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm text-muted-foreground mb-3">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {errorRetryMessage}
              </Button>
            </div>
          ) : initialLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">
                {loadingMessage}
              </span>
            </div>
          ) : data.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? emptyMessage : "Нет доступных элементов."}
            </div>
          ) : (
            <div className="p-1">
              {data.map((item) => (
                <SelectItem
                  key={String(item[valueField])}
                  value={String(item[valueField])}
                  className="cursor-pointer"
                >
                  {renderItem ? renderItem(item) : defaultRenderItem(item)}
                </SelectItem>
              ))}

              {/* Триггер бесконечной прокрутки */}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {loading && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-xs text-muted-foreground">
                        Загрузка...
                      </span>
                    </>
                  )}
                </div>
              )}

              {!hasMore && data.length > 0 && (
                <div className="py-2 text-center text-xs text-muted-foreground border-t">
                  {searchQuery
                    ? `Найдено ${data.length} элемент${data.length === 1 ? "" : "ов"} по запросу "${searchQuery}"`
                    : `Все ${data.length} элементов загружено`}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
