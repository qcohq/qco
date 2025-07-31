"use client";

import { Button } from "@qco/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@qco/ui/components/command";
import { Separator } from "@qco/ui/components/separator";
import { cn } from "@qco/ui/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowLeft, Check, ChevronRight, Search, X } from "lucide-react";
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useCategoryCombobox } from "./context";
import type { CategoryOption } from "./types";

// Memoized option item to prevent unnecessary re-renders
const OptionItem = memo(function OptionItem({
  option,
  isActive,
  isSelected,
  index,
  showLevelUp,
  handleSelect,
  handleLevelDown,
  setFocusedIndex,
  renderOption,
  searchQuery,
  navigationDirection,
  prevLevel,
  currentLevelLength,
}: {
  option: CategoryOption;
  isActive: boolean;
  isSelected: boolean;
  index: number;
  showLevelUp: boolean;
  handleSelect: (value: string) => void;
  handleLevelDown: (option: CategoryOption) => void;
  setFocusedIndex: (index: number) => void;
  renderOption?: (
    option: CategoryOption,
    isSelected: boolean,
  ) => React.ReactNode;
  searchQuery: string;
  navigationDirection: "forward" | "backward" | null;
  prevLevel: number;
  currentLevelLength: number;
}) {
  const adjustedIndex = showLevelUp ? index + 1 : index;

  // Determine animation class based on navigation direction
  const getAnimationClass = () => {
    if (searchQuery) return "animate-in fade-in-50 duration-300";

    if (
      navigationDirection === "forward" ||
      (!navigationDirection && currentLevelLength > prevLevel)
    ) {
      return "animate-in slide-in-from-right-5 duration-300";
    }
    if (
      navigationDirection === "backward" ||
      (!navigationDirection && currentLevelLength < prevLevel)
    ) {
      return "animate-in slide-in-from-left-5 duration-300";
    }
    return "animate-in fade-in-50 duration-300";
  };

  return (
    <div
      className={cn(
        "transition-colors bg-background grid cursor-pointer items-center gap-2 overflow-hidden",
        {
          "grid-cols-[1fr_32px]": option.has_children && !searchQuery,
        },
        getAnimationClass(),
      )}
      style={{ animationDelay: `${index * 20}ms` }}
    >
      <CommandItem
        value={`${option.label} ${option.description || ""}`}
        onSelect={() => handleSelect(option.value)}
        disabled={option.disabled}
        onMouseEnter={() => setFocusedIndex(adjustedIndex)}
        onMouseLeave={() => setFocusedIndex(-1)}
        className={cn(
          "transition-all duration-200 ease-in-out",
          option.disabled && "opacity-50 cursor-not-allowed",
          isActive && "bg-muted",
          "hover:bg-accent hover:text-accent-foreground",
        )}
        aria-selected={isSelected}
      >
        {renderOption ? (
          renderOption(option, isSelected)
        ) : (
          <>
            <div className="mr-2 flex h-4 w-4 items-center justify-center">
              {isSelected ? (
                <Check className="h-4 w-4 transition-transform duration-200 ease-in-out animate-in zoom-in-50 text-primary" />
              ) : (
                option.icon
              )}
            </div>
            <div className="flex flex-col w-full">
              <div className="flex items-center">
                {/* Добавляем отступ в зависимости от уровня вложенности */}
                {option.level && option.level > 0 && (
                  <span 
                    className="inline-block" 
                    style={{ 
                      width: `${option.level * 16}px`,
                      marginRight: '4px' 
                    }}
                  />
                )}
                {/* Показываем вертикальную линию для вложенных уровней */}
                {option.level && option.level > 0 && (
                  <span className="inline-block h-4 w-4 mr-1 text-gray-400">└</span>
                )}
                <span>{option.label}</span>
              </div>
              {option.description && (
                <span className="text-xs text-muted-foreground pl-4">
                  {option.description}
                </span>
              )}
            </div>
          </>
        )}
      </CommandItem>
      {option.has_children && !searchQuery && (
        <button
          className={cn(
            "text-muted-foreground flex size-8 appearance-none items-center justify-center rounded-md outline-none transition-all duration-200",
            "hover:bg-muted active:bg-accent hover:text-foreground",
            "group relative overflow-hidden",
          )}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLevelDown(option);
          }}
          aria-label={`Перейти в категорию ${option.label}`}
        >
          <span className="absolute inset-0 bg-primary/5 scale-0 rounded-full transition-transform duration-300 group-hover:scale-100" />
          <ChevronRight className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
});

// Memoized back button to prevent unnecessary re-renders
const BackButton = memo(function BackButton({
  focusedIndex,
  setFocusedIndex,
  handleLevelUp,
  currentLevel,
}: {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleLevelUp: () => void;
  currentLevel: { id: string; label: string }[];
}) {
  return (
    <div className="p-1 animate-in slide-in-from-left-5 duration-300">
      <button
        data-active={focusedIndex === 0}
        className={cn(
          "transition-all duration-200 grid w-full appearance-none grid-cols-[20px_1fr] items-center justify-center gap-2 rounded-md px-2 py-1.5 text-left outline-none",
          "data-[active=true]:bg-muted",
          "hover:bg-muted/50 active:bg-muted",
          "group relative overflow-hidden",
        )}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleLevelUp();
        }}
        onMouseEnter={() => setFocusedIndex(0)}
        onMouseLeave={() => setFocusedIndex(-1)}
        tabIndex={-1}
        aria-label="Вернуться назад"
      >
        <span className="absolute inset-0 bg-primary/5 scale-0 rounded-md transition-transform duration-300 group-hover:scale-100" />
        <div className="flex justify-center relative z-10">
          <ChevronRight className="h-4 w-4 text-muted-foreground rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </div>
        <span className="text-sm relative z-10 group-hover:translate-x-0.5 transition-transform duration-200">
          {currentLevel[currentLevel.length - 1]?.label || "Назад"}
        </span>
      </button>
    </div>
  );
});

// Memoized breadcrumb path to prevent unnecessary re-renders
const BreadcrumbPath = memo(function BreadcrumbPath({
  currentLevel,
  handleLevelUp,
}: {
  currentLevel: { id: string; label: string }[];
  handleLevelUp: () => void;
}) {
  return (
    <div className="px-3 py-2 flex items-center text-sm text-muted-foreground overflow-x-auto scrollbar-none animate-in fade-in-50 duration-200">
      <button
        type="button"
        onClick={handleLevelUp}
        className="flex items-center hover:text-foreground transition-colors duration-200 mr-1"
        aria-label="Вернуться на уровень выше"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
      </button>
      <div className="flex items-center flex-nowrap">
        {currentLevel.map((level, index) => (
          <div key={level.id} className="flex items-center whitespace-nowrap">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground/60" />
            )}
            <span
              className={cn(
                "transition-colors duration-200",
                index === currentLevel.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Update the content component to handle hierarchical navigation
export function CategoryComboboxContent({
  virtualized = false,
  virtualizedItemCount = 10,
}: {
  virtualized?: boolean;
  virtualizedItemCount?: number;
}) {
  const {
    filteredOptions,
    searchQuery,
    setSearchQuery,
    handleSelect,
    isSelected,
    emptyMessage,
    maxHeight,
    renderOption,
    multiple,
    selectedValues,
    handleOpenChange,
    handleClear,
    focusedIndex,
    setFocusedIndex,
    isHierarchical,
    currentLevel,
    handleLevelUp,
    handleLevelDown,
    navigationDirection,
    isNavigating,
  } = useCategoryCombobox();

  const parentRef = useRef<HTMLDivElement>(null);
  const [prevLevel, setPrevLevel] = useState<number>(0);
  const [animationTimeoutId, setAnimationTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  // Track level changes for animations
  useEffect(() => {
    setPrevLevel(currentLevel.length);
  }, [currentLevel.length]);

  // Control animation timing
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isNavigating) {
      setShouldAnimate(true);

      if (animationTimeoutId) {
        clearTimeout(animationTimeoutId);
      }

      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 500);

      setAnimationTimeoutId(timer);

      return () => clearTimeout(timer);
    }
  }, [isNavigating, animationTimeoutId]);

  // Setup virtualizer with optimized configuration
  const rowVirtualizer = useVirtualizer({
    count:
      filteredOptions.length +
      (currentLevel.length > 0 && !searchQuery ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // Fixed height for each item
    overscan: 5,
    enabled: virtualized && filteredOptions.length > virtualizedItemCount,
  });

  // Handle keyboard navigation - memoized to prevent recreation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const showLevelUp = currentLevel.length > 0 && !searchQuery;
      const optionsLength = filteredOptions.length + (showLevelUp ? 1 : 0);

      if (optionsLength === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex(
          focusedIndex < optionsLength - 1 ? focusedIndex + 1 : focusedIndex,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(focusedIndex > 0 ? focusedIndex - 1 : focusedIndex);
      } else if (e.key === "ArrowRight") {
        const adjustedIndex = showLevelUp ? focusedIndex - 1 : focusedIndex;
        if (adjustedIndex >= 0 && adjustedIndex < filteredOptions.length) {
          const option = filteredOptions[adjustedIndex];
          if (option?.has_children && !searchQuery) {
            e.preventDefault();
            handleLevelDown(option);
          }
        }
      } else if (e.key === "ArrowLeft") {
        if (showLevelUp) {
          e.preventDefault();
          handleLevelUp();
        }
      } else if (e.key === "Enter" && focusedIndex !== -1) {
        e.preventDefault();

        if (showLevelUp && focusedIndex === 0) {
          handleLevelUp();
          return;
        }

        const adjustedIndex = showLevelUp ? focusedIndex - 1 : focusedIndex;
        if (adjustedIndex >= 0 && adjustedIndex < filteredOptions.length) {
          const option = filteredOptions[adjustedIndex];
          if (option) {
            handleSelect(option.value);
          }
        }
      }
    },
    [
      currentLevel.length,
      searchQuery,
      filteredOptions,
      focusedIndex,
      setFocusedIndex,
      handleLevelDown,
      handleLevelUp,
      handleSelect,
    ],
  );

  // Add keyboard event listener with cleanup
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Determine if we should show the level up button
  const showLevelUp = currentLevel.length > 0 && !searchQuery;

  // Determine animation classes based on navigation direction
  const getContainerAnimationClass = () => {
    if (!isHierarchical || searchQuery)
      return "animate-in fade-in-50 duration-300";

    if (shouldAnimate) {
      if (navigationDirection === "forward") {
        return "animate-out slide-out-to-left-1/4 fade-out-80 duration-200";
      }
      if (navigationDirection === "backward") {
        return "animate-out slide-out-to-right-1/4 fade-out-80 duration-200";
      }
    }

    if (currentLevel.length > prevLevel) {
      return "animate-in slide-in-from-right-1/4 fade-in-80 duration-300";
    }
    if (currentLevel.length < prevLevel) {
      return "animate-in slide-in-from-left-1/4 fade-in-80 duration-300";
    }

    return "animate-in fade-in-50 duration-300";
  };

  return (
    <Command className="w-full">
      <div className="flex items-center border-b px-3">
        <Search
          className="mr-2 h-4 w-4 shrink-0 opacity-50"
          aria-hidden="true"
        />
        <CommandInput
          placeholder={
            multiple
              ? "Поиск категорий... (поиск очистится после выбора)"
              : "Поиск категорий..."
          }
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Breadcrumb navigation - only render when needed */}
      {isHierarchical && !searchQuery && currentLevel.length > 0 && (
        <BreadcrumbPath
          currentLevel={currentLevel}
          handleLevelUp={handleLevelUp}
        />
      )}

      <CommandList
        className={cn("max-h-[--max-height] overflow-auto relative")}
        style={{ "--max-height": `${maxHeight}px` } as React.CSSProperties}
        ref={parentRef}
      >
        <CommandEmpty>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            {searchQuery && (
              <p className="text-xs text-muted-foreground mt-1">
                Попробуйте изменить поисковый запрос
              </p>
            )}
          </div>
        </CommandEmpty>
        <CommandGroup className={cn("relative", getContainerAnimationClass())}>
          {showLevelUp && (
            <>
              <BackButton
                focusedIndex={focusedIndex}
                setFocusedIndex={setFocusedIndex}
                handleLevelUp={handleLevelUp}
                currentLevel={currentLevel}
              />
              <Separator className="animate-in fade-in-50 duration-300" />
            </>
          )}

          {virtualized && filteredOptions.length > virtualizedItemCount ? (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
              className="animate-in fade-in-50 duration-300"
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                // Handle level up button in virtualized list
                if (showLevelUp && virtualRow.index === 0) {
                  return null; // We handle the level up button separately above
                }

                const adjustedIndex = showLevelUp
                  ? virtualRow.index - 1
                  : virtualRow.index;
                if (
                  adjustedIndex < 0 ||
                  adjustedIndex >= filteredOptions.length
                )
                  return null;

                const option = filteredOptions[adjustedIndex];
                if (!option) return null;

                const isActive = focusedIndex === virtualRow.index;

                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <OptionItem
                      option={option}
                      isActive={isActive}
                      isSelected={isSelected(option.value)}
                      index={adjustedIndex}
                      showLevelUp={showLevelUp}
                      handleSelect={handleSelect}
                      handleLevelDown={handleLevelDown}
                      setFocusedIndex={setFocusedIndex}
                      renderOption={renderOption}
                      searchQuery={searchQuery}
                      navigationDirection={navigationDirection}
                      prevLevel={prevLevel}
                      currentLevelLength={currentLevel.length}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <OptionItem
                key={option.value}
                option={option}
                isActive={focusedIndex === (showLevelUp ? index + 1 : index)}
                isSelected={isSelected(option.value)}
                index={index}
                showLevelUp={showLevelUp}
                handleSelect={handleSelect}
                handleLevelDown={handleLevelDown}
                setFocusedIndex={setFocusedIndex}
                renderOption={renderOption}
                searchQuery={searchQuery}
                navigationDirection={navigationDirection}
                prevLevel={prevLevel}
                currentLevelLength={currentLevel.length}
              />
            ))
          )}
        </CommandGroup>
        {multiple && selectedValues.length > 0 && (
          <>
            <CommandSeparator className="animate-in fade-in-50 duration-300" />
            <div className="p-2 animate-in fade-in-50 duration-300">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center text-sm transition-all duration-200 hover:bg-destructive/10 group relative overflow-hidden"
                onClick={(e) => {
                  handleClear(e);
                  handleOpenChange(false);
                }}
              >
                <span className="absolute inset-0 bg-destructive/5 scale-0 rounded-md transition-transform duration-300 group-hover:scale-100" />
                <span className="relative z-10 flex items-center gap-2">
                  <X className="h-3 w-3" />
                  Очистить выбор ({selectedValues.length})
                </span>
              </Button>
            </div>
          </>
        )}

        {/* Подсказка о клавиатурной навигации */}
        <div className="px-3 py-2 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Используйте ↑↓ для навигации</span>
            <span>Enter для выбора</span>
          </div>
        </div>
      </CommandList>
    </Command>
  );
}

// Export as default for lazy loading
// export default memo(CategoryComboboxContent)
