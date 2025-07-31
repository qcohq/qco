"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { cn } from "@qco/ui/lib/utils";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { CategoryComboboxContent } from "./content";
import { CategoryComboboxProvider } from "./context";
import { ErrorMessage } from "./error-message";
import { CategoryComboboxTrigger } from "./trigger";
import type {
  CategoryComboboxProps,
  CategoryItem,
  CategoryOption,
} from "./types";

/**
 * Convert hierarchical category items to flattened options
 */
function convertCategoriesToOptions(
  categories: CategoryItem[],
  parentPath: string[] = [],
  level = 0
): CategoryOption[] {
  return categories.flatMap((category) => {
    const option: CategoryOption = {
      value: category.id,
      label: category.name,
      has_children: Boolean(category.children?.length),
      description: parentPath.length > 0 ? parentPath.join(" > ") : undefined,
      // Добавляем информацию об уровне вложенности
      level: level,
    };

    const childOptions = category.children
      ? convertCategoriesToOptions(
          category.children, 
          [...parentPath, category.name],
          level + 1
        )
      : [];

    return [option, ...childOptions];
  });
}

/**
 * CategoryCombobox component
 *
 * A versatile, accessible dropdown component for selecting categories
 * with support for hierarchical data, search, and multiple selection.
 */
export const CategoryCombobox = forwardRef<
  HTMLInputElement,
  CategoryComboboxProps
>(
  (
    {
      categories,
      options: propOptions,
      value,
      onChange,
      multiple = false,
      placeholder = "Выберите категорию...",
      searchable = true,
      filterFunction,
      disabled = false,
      loading = false,
      maxHeight = 300,
      emptyMessage = "Ничего не найдено.",
      triggerButton,
      className,
      popoverClassName,
      triggerClassName,
      position = "bottom",
      showBadges = false,
      clearable = true,
      renderOption,
      required = false,
      errorMessage,
      id,
      ariaLabel,
      onFocus,
      onBlur,
      virtualized = false,
      virtualizedItemCount = 10,
    },
    ref,
  ) => {
    // Convert categories to options if provided - memoized to prevent recalculation
    const options = useMemo(() => {
      if (propOptions) return propOptions;
      if (categories) {
        return convertCategoriesToOptions(categories);
      }
      return [];
    }, [propOptions, categories]);

    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);

    // Validate required field
    useEffect(() => {
      if (required) {
        if (Array.isArray(value) ? value.length === 0 : !value) {
          setError(errorMessage || "Это поле обязательно для заполнения");
        } else {
          setError(undefined);
        }
      }
    }, [value, required, errorMessage]);

    // Handle open/close
    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
    };

    return (
      <div className={cn("relative", className)}>
        <CategoryComboboxProvider
          value={value}
          onChange={onChange}
          options={options}
          categories={categories || []}
          multiple={multiple}
          searchable={searchable}
          disabled={disabled}
          loading={loading}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          maxHeight={maxHeight}
          showBadges={showBadges}
          clearable={clearable}
          renderOption={renderOption}
          filterFunction={filterFunction}
        >
          <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <div>
                <CategoryComboboxTrigger
                  ref={ref}
                  className={triggerClassName}
                  placeholder={placeholder}
                  disabled={disabled}
                  id={id}
                  ariaLabel={ariaLabel}
                  required={required}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  triggerButton={triggerButton}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "animate-in fade-in-0 zoom-in-95 w-full min-w-[var(--radix-popover-trigger-width)] p-0 duration-200",
                popoverClassName,
              )}
              align="start"
              side={position}
            >
              {open && (
                <CategoryComboboxContent
                  position={position}
                  virtualized={virtualized}
                  virtualizedItemCount={virtualizedItemCount}
                />
              )}
            </PopoverContent>
          </Popover>
        </CategoryComboboxProvider>
        {error && <ErrorMessage message={error} />}
      </div>
    );
  },
);

CategoryCombobox.displayName = "CategoryCombobox";

// Export types
export type { CategoryItem, CategoryOption, CategoryComboboxProps };
