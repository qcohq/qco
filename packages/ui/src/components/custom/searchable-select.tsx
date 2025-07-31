"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, RefreshCw, Search } from "lucide-react";

import { useIntersectionObserver } from "../../hooks/use-intersection-observer";
import { useSearchableData } from "../../hooks/use-searchable-data";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Input } from "../input";
import { ScrollArea } from "../scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

interface SearchableSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  apiEndpoint: string;
  searchFields: string[];
  displayField: string;
  valueField: string;
  renderItem?: (item: any) => React.ReactNode;
  renderSelectedItem?: (item: any) => React.ReactNode;
  limit?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  errorRetryMessage?: string;
}

export default function SearchableSelect({
  value,
  onValueChange,
  placeholder = "Search and select...",
  className,
  apiEndpoint,
  searchFields,
  displayField,
  valueField,
  renderItem,
  renderSelectedItem,
  limit = 20,
  emptyMessage = "No items found.",
  loadingMessage = "Loading...",
  errorRetryMessage = "Try Again",
}: SearchableSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Build API endpoint with search fields
  const fullApiEndpoint = `${apiEndpoint}&searchFields=${searchFields.join(",")}`;

  const { data, loading, initialLoading, error, hasMore, loadMore, refresh } =
    useSearchableData({
      apiEndpoint: fullApiEndpoint,
      limit,
      search: searchQuery,
    });

  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  // Find selected item details
  useEffect(() => {
    if (value) {
      const item = data.find((item: any) => String(item[valueField]) === value);
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
      // Ensure input maintains focus
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
      // Use setTimeout to ensure the DOM is ready before focusing
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
    (item: any) => (
      <div className="flex w-full items-center justify-between">
        <span className="truncate">{String(item[displayField])}</span>
        {value === String(item[valueField]) && (
          <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        )}
      </div>
    ),
    [displayField, valueField, value],
  );

  const defaultRenderSelectedItem = useCallback(
    (item: any) => (
      <span className="truncate">{String(item[displayField])}</span>
    ),
    [displayField],
  );

  // Maintain focus on search input after results update
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, data, loading]);

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
            placeholder={`Search ${searchFields.join(", ")}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            ref={searchInputRef}
          />
        </div>

        <ScrollArea className="h-[300px]">
          {error ? (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <AlertCircle className="text-destructive mb-2 h-8 w-8" />
              <p className="text-muted-foreground mb-3 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {errorRetryMessage}
              </Button>
            </div>
          ) : initialLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span className="text-muted-foreground text-sm">
                {loadingMessage}
              </span>
            </div>
          ) : data.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              {searchQuery ? emptyMessage : "No items available."}
            </div>
          ) : (
            <div className="p-1">
              {data.map((item: any) => (
                <SelectItem
                  key={String(item[valueField])}
                  value={String(item[valueField])}
                  className="cursor-pointer"
                >
                  {renderItem ? renderItem(item) : defaultRenderItem(item)}
                </SelectItem>
              ))}

              {/* Infinite scroll trigger */}
              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4"
                >
                  {loading && (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground text-xs">
                        Loading more...
                      </span>
                    </>
                  )}
                </div>
              )}

              {!hasMore && data.length > 0 && (
                <div className="text-muted-foreground border-t py-2 text-center text-xs">
                  {searchQuery
                    ? `Found ${data.length} item${data.length === 1 ? "" : "s"} matching "${searchQuery}"`
                    : `All ${data.length} items loaded`}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
