"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { cn } from "@qco/ui/lib/utils";
import { ChevronsUpDown, Loader2, X } from "lucide-react";
import type React from "react";
import type { CSSProperties } from "react";
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useCategoryCombobox } from "./context";

interface TriggerProps {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  triggerButton?: React.ReactNode;
}

// Memoized badge component to prevent unnecessary re-renders
const CategoryBadge = memo(function CategoryBadge({
  option,
  handleSelect,
  clearable,
}: {
  option: { value: string; label: string };
  handleSelect: (value: string) => void;
  clearable: boolean;
}) {
  return (
    <Badge
      key={option.value}
      variant="secondary"
      className="mr-1 mb-1 animate-in fade-in-50 slide-in-from-top-2 duration-200 hover:bg-secondary/80 transition-colors"
    >
      {option.label}
      {clearable && (
        <button
          type="button"
          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary-foreground/20 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSelect(option.value);
          }}
          aria-label={`Удалить ${option.label}`}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Удалить {option.label}</span>
        </button>
      )}
    </Badge>
  );
});

export const CategoryComboboxTrigger = forwardRef<
  HTMLInputElement,
  TriggerProps
>(
  (
    {
      className,
      placeholder,
      disabled,
      id,
      ariaLabel,
      required,
      onFocus,
      onBlur,
      triggerButton,
    },
    ref,
  ) => {
    const {
      selectedValues,
      selectedOptions,
      searchQuery,
      setSearchQuery,
      handleOpenChange,
      isOpen,
      loading,
      multiple,
      showBadges,
      clearable,
      handleClear,
      handleSelect,
    } = useCategoryCombobox();

    const innerRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayMode, setDisplayMode] = useState<"selected" | "search">(
      "selected",
    );

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
      [],
    );

    // Calculate tag width for styling - memoized to prevent recalculation
    const tagWidth =
      selectedValues.length > 0
        ? 28 + selectedValues.length.toString().length * 8
        : 0;

    // Handle animation states when focus changes or selection changes
    useEffect(() => {
      if (isFocused && !multiple && selectedValues.length > 0) {
        setIsAnimating(true);
        setDisplayMode("search");
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Match this with the CSS transition duration
        return () => clearTimeout(timer);
      }
      if (!isFocused && !multiple && selectedValues.length > 0) {
        setIsAnimating(true);
        setDisplayMode("selected");
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300); // Match this with the CSS transition duration
        return () => clearTimeout(timer);
      }
    }, [isFocused, multiple, selectedValues.length]);

    // Handle selection changes
    useEffect(() => {
      if (!multiple && selectedValues.length > 0) {
        setIsAnimating(true);
        const timer = setTimeout(() => {
          setIsAnimating(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [selectedValues, multiple]);

    const showTag = selectedValues.length > 0;

    // Get the selected option label for single selection
    const selectedLabel =
      !multiple && selectedValues.length > 0
        ? selectedOptions[0]?.label || ""
        : "";

    // Handle focus event with performance optimization
    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    // Handle blur event with performance optimization
    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
      if (!multiple && selectedValues.length > 0 && !searchQuery) {
        // Restore the selected value display when losing focus with empty search
        setSearchQuery("");
      }
    };

    return (
      <>
        {triggerButton || (
          <div
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            data-anchor
            // biome-ignore lint/a11y/useSemanticElements: Кастомный combobox компонент
            className={cn(
              "relative flex cursor-pointer items-center gap-x-2 overflow-hidden",
              "h-10 w-full rounded-md",
              "bg-background border transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              "has-[:invalid]:border-destructive has-[[aria-invalid=true]]:border-destructive",
              "has-[:disabled]:bg-muted has-[:disabled]:text-muted-foreground has-[:disabled]:cursor-not-allowed",
              {
                "ring-2 ring-ring ring-offset-2": isOpen,
              },
              className,
            )}
            style={
              {
                "--tag-width": `${tagWidth}px`,
              } as CSSProperties
            }
            onClick={() => {
              if (!isOpen && !disabled) {
                handleOpenChange(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (!isOpen && !disabled) {
                  handleOpenChange(true);
                }
              }
            }}
            tabIndex={disabled ? -1 : 0}
          >
            {showTag && !showBadges && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClear(e);
                }}
                className="bg-background hover:bg-muted text-xs font-medium text-muted-foreground transition-colors absolute left-0.5 top-0.5 flex h-[28px] items-center rounded-[4px] border py-[3px] pl-1.5 pr-1 outline-none animate-in fade-in-50 slide-in-from-left-2 duration-200"
                aria-label="Очистить выбор"
              >
                <span className="tabular-nums">{selectedValues.length}</span>
                <X className="h-3 w-3 text-muted-foreground ml-1" />
              </button>
            )}

            {showBadges && multiple ? (
              <div className="flex flex-wrap gap-1 max-w-[calc(100%-40px)] overflow-hidden pl-2 py-1">
                {selectedOptions.slice(0, 3).map((option) => (
                  <CategoryBadge
                    key={option.value}
                    option={option}
                    handleSelect={handleSelect}
                    clearable={clearable}
                  />
                ))}
                {selectedOptions.length > 3 && (
                  <Badge
                    variant="outline"
                    className="mr-1 mb-1 animate-in fade-in-50 slide-in-from-top-2 duration-200"
                  >
                    +{selectedOptions.length - 3}
                  </Badge>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Selected item display with animation */}
                {!multiple && selectedValues.length > 0 && (
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center transition-all duration-300 ease-in-out",
                      {
                        "opacity-100 translate-y-0":
                          displayMode === "selected" && !isAnimating,
                        "opacity-0 translate-y-2":
                          displayMode === "search" || isAnimating,
                        "pointer-events-none":
                          displayMode === "search" || isFocused,
                      },
                    )}
                    style={{
                      transform:
                        displayMode === "selected" && !isAnimating
                          ? "translateY(0)"
                          : "translateY(2px)",
                      opacity:
                        displayMode === "selected" && !isAnimating ? 1 : 0,
                      transition:
                        "transform 300ms ease-in-out, opacity 300ms ease-in-out",
                    }}
                  >
                    <span className="text-sm truncate">{selectedLabel}</span>
                  </div>
                )}

                {/* Input field with animation */}
                <input
                  ref={innerRef}
                  id={id}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  disabled={disabled}
                  required={required}
                  aria-label={ariaLabel || "Выбор категории"}
                  aria-expanded={isOpen}
                  aria-autocomplete="list"
                  role="combobox"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={cn(
                    "text-sm w-full h-full cursor-pointer appearance-none bg-transparent pr-8 outline-none transition-all duration-300 ease-in-out",
                    "hover:bg-muted/50",
                    "focus:cursor-text",
                    "placeholder:text-muted-foreground",
                    {
                      "pl-2": !showTag || (showBadges && multiple),
                      "pl-[calc(var(--tag-width)+8px)]":
                        showTag && !(showBadges && multiple),
                      "opacity-0":
                        !isFocused &&
                        !multiple &&
                        selectedValues.length > 0 &&
                        displayMode === "selected",
                      "opacity-100":
                        isFocused ||
                        multiple ||
                        selectedValues.length === 0 ||
                        displayMode === "search",
                    },
                  )}
                  placeholder={selectedValues.length > 0 ? "" : placeholder}
                />
              </div>
            )}
            <div className="absolute right-0 flex items-center pr-2">
              {clearable &&
                selectedValues.length > 0 &&
                !disabled &&
                !multiple && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 mr-1 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-200"
                    onClick={handleClear}
                    aria-label="Очистить"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Очистить</span>
                  </Button>
                )}
              {loading ? (
                <Loader2
                  className="h-4 w-4 animate-spin opacity-70"
                  aria-hidden="true"
                />
              ) : (
                <ChevronsUpDown
                  className="h-4 w-4 opacity-50"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

CategoryComboboxTrigger.displayName = "CategoryComboboxTrigger";

export default memo(CategoryComboboxTrigger);
