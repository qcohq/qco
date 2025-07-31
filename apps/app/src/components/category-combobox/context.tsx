"use client";

import type React from "react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  CategoryComboboxContextType,
  CategoryItem,
  CategoryLevel,
  CategoryOption,
} from "./types";

// Create context with a default value
const CategoryComboboxContext = createContext<
  CategoryComboboxContextType | undefined
>(undefined);

// Debounce function for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount or value change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Provider component for CategoryCombobox context
 */
export function CategoryComboboxProvider({
  children,
  value,
  onChange,
  options = [],
  categories = [],
  multiple = false,
  disabled = false,
  loading = false,
  placeholder = "Выберите категорию...",
  emptyMessage = "Ничего не найдено.",
  maxHeight = 300,
  showBadges = false,
  clearable = true,
  renderOption,
  filterFunction,
}: {
  children: ReactNode;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: CategoryOption[];
  categories?: CategoryItem[];
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  maxHeight?: number;
  showBadges?: boolean;
  clearable?: boolean;
  renderOption?: (option: CategoryOption, isSelected: boolean) => ReactNode;
  filterFunction?: (query: string, option: CategoryOption) => boolean;
}) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [currentLevel, setCurrentLevel] = useState<CategoryLevel[]>([]);
  const [navigationDirection, setNavigationDirection] = useState<
    "forward" | "backward" | null
  >(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Debounce search query to reduce filter operations
  const debouncedSearchQuery = useDebounce(searchQuery, 150);

  // Cache for filtered options to avoid recalculation
  const optionsCache = useRef<Record<string, CategoryOption[]>>({});

  // Determine if we're using hierarchical data
  const isHierarchical = categories.length > 0;

  // Convert single value to array for consistent internal handling
  const selectedValues = useMemo(() => {
    return Array.isArray(value) ? value : value ? [value] : [];
  }, [value]);

  // Get selected options based on values - memoized to prevent recalculation
  const selectedOptions = useMemo(() => {
    return options.filter((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  // Get current level categories with caching
  const getCurrentLevelOptions = useCallback(() => {
    // Create a cache key based on search query and current level
    const cacheKey = `${debouncedSearchQuery}:${currentLevel.map((l) => l.id).join(",")}`;

    // Check if we have cached results
    if (optionsCache.current[cacheKey]) {
      return optionsCache.current[cacheKey];
    }

    let result: CategoryOption[];

    if (debouncedSearchQuery) {
      // When searching, show all options that match the query from the flattened options
      result = options.filter((option) => {
        if (filterFunction) {
          return filterFunction(debouncedSearchQuery, option);
        }

        return (
          option.label
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          option.description
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
        );
      });
    } else if (!isHierarchical) {
      result = options;
    } else {
      // Find options for the current level
      const findOptionsForLevel = (
        items: CategoryItem[],
        level: CategoryLevel[] = [],
      ): CategoryOption[] => {
        if (level.length === 0) {
          return items.map((item) => ({
            value: item.id,
            label: item.name,
            has_children: Boolean(item.children?.length),
          }));
        }

        const currentLevelId = level[0]?.id;
        if (!currentLevelId) return [];

        const currentItem = items.find((item) => item.id === currentLevelId);

        if (!currentItem?.children) {
          return [];
        }

        if (level.length === 1) {
          return currentItem.children.map((item) => ({
            value: item.id,
            label: item.name,
            has_children: Boolean(item.children?.length),
          }));
        }

        return findOptionsForLevel(currentItem.children, level.slice(1));
      };

      result = findOptionsForLevel(categories, currentLevel);
    }

    // Cache the results
    optionsCache.current[cacheKey] = result;
    return result;
  }, [
    categories,
    currentLevel,
    debouncedSearchQuery,
    filterFunction,
    isHierarchical,
    options,
  ]);

  // Get filtered options - memoized to prevent recalculation
  const filteredOptions = useMemo(() => {
    return getCurrentLevelOptions();
  }, [getCurrentLevelOptions]);

  // Clear cache when dependencies change
  useEffect(() => {
    optionsCache.current = {};
  }, []);

  // Handle level navigation with animation states
  const handleLevelUp = useCallback(() => {
    setNavigationDirection("backward");
    setIsNavigating(true);

    // Small delay to allow animation to start before changing the level
    setTimeout(() => {
      setCurrentLevel((prev) => prev.slice(0, prev.length - 1));
      setFocusedIndex(0);

      // Reset navigation state after animation completes
      setTimeout(() => {
        setIsNavigating(false);
      }, 300);
    }, 50);
  }, []);

  const handleLevelDown = useCallback((option: CategoryOption) => {
    if (option.has_children) {
      setNavigationDirection("forward");
      setIsNavigating(true);

      // Small delay to allow animation to start before changing the level
      setTimeout(() => {
        setCurrentLevel((prev) => [
          ...prev,
          { id: option.value, label: option.label },
        ]);
        setFocusedIndex(0);

        // Reset navigation state after animation completes
        setTimeout(() => {
          setIsNavigating(false);
        }, 300);
      }, 50);
    }
  }, []);

  // Reset level when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentLevel([]);
    }
  }, [debouncedSearchQuery]);

  // Handle selection change
  const handleSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];

        onChange(newValues);

        // Очищаем поиск после выбора в мультивыборе
        setSearchQuery("");

        // Показываем краткую подсказку о том, что категория добавлена
        const selectedOption = options.find((opt) => opt.value === optionValue);
        if (selectedOption && !selectedValues.includes(optionValue)) {
          // Можно добавить toast уведомление здесь, если нужно
          // console.log(`Категория "${selectedOption.label}" добавлена`);
        }
      } else {
        onChange(optionValue);
        setIsOpen(false);
      }
    },
    [multiple, onChange, selectedValues, options],
  );

  // Handle clearing selection
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiple ? [] : "");
    },
    [multiple, onChange],
  );

  // Handle open/close state
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSearchQuery("");
      setCurrentLevel([]);
      setNavigationDirection(null);
      setIsNavigating(false);
    }
    setIsOpen(open);
  }, []);

  // Check if a value is selected
  const isSelected = useCallback(
    (value: string) => {
      return selectedValues.includes(value);
    },
    [selectedValues],
  );

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      selectedValues,
      searchQuery,
      isOpen,
      setSearchQuery,
      handleSelect,
      handleClear,
      handleOpenChange,
      loading,
      disabled,
      multiple,
      clearable,
      showBadges,
      placeholder,
      emptyMessage,
      maxHeight,
      renderOption,
      filteredOptions,
      selectedOptions,
      isSelected,
      focusedIndex,
      setFocusedIndex,
      isHierarchical,
      currentLevel,
      setCurrentLevel,
      handleLevelUp,
      handleLevelDown,
      getCurrentLevelOptions,
      navigationDirection,
      isNavigating,
    }),
    [
      selectedValues,
      searchQuery,
      isOpen,
      handleSelect,
      handleClear,
      handleOpenChange,
      loading,
      disabled,
      multiple,
      clearable,
      showBadges,
      placeholder,
      emptyMessage,
      maxHeight,
      renderOption,
      filteredOptions,
      selectedOptions,
      isSelected,
      focusedIndex,
      isHierarchical,
      currentLevel,
      handleLevelUp,
      handleLevelDown,
      getCurrentLevelOptions,
      navigationDirection,
      isNavigating,
    ],
  );

  return (
    <CategoryComboboxContext.Provider value={contextValue}>
      {children}
    </CategoryComboboxContext.Provider>
  );
}

/**
 * Hook to use CategoryCombobox context
 */
export function useCategoryCombobox() {
  const context = useContext(CategoryComboboxContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryCombobox must be used within a CategoryComboboxProvider",
    );
  }
  return context;
}
