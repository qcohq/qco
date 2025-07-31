import type React from "react";
import type { ReactNode } from "react";

/**
 * Represents a category item in the hierarchical structure
 */
export interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
}

/**
 * Represents a flattened category option for display
 */
export interface CategoryOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  has_children?: boolean;
  level?: number;
}

/**
 * Represents a navigation level in the category hierarchy
 */
export interface CategoryLevel {
  id: string;
  label: string;
}

/**
 * Props for the CategoryCombobox component
 */
export interface CategoryComboboxProps {
  /**
   * Array of category items in hierarchical structure
   */
  categories?: CategoryItem[];

  /**
   * Array of flattened category options (alternative to categories)
   */
  options?: CategoryOption[];

  /**
   * Currently selected value(s)
   */
  value: string | string[];

  /**
   * Callback fired when selection changes
   */
  onChange: (value: string | string[]) => void;

  /**
   * Allow multiple selections
   * @default false
   */
  multiple?: boolean;

  /**
   * Placeholder text when no option is selected
   * @default "Выберите категорию..."
   */
  placeholder?: string;

  /**
   * Enable search functionality
   * @default true
   */
  searchable?: boolean;

  /**
   * Custom filter function for search
   */
  filterFunction?: (query: string, option: CategoryOption) => boolean;

  /**
   * Disable the combobox
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Maximum height of dropdown in pixels
   * @default 300
   */
  maxHeight?: number;

  /**
   * Custom empty message when no options match search
   * @default "Ничего не найдено."
   */
  emptyMessage?: string;

  /**
   * Custom trigger button
   */
  triggerButton?: ReactNode;

  /**
   * Custom class name for the combobox container
   */
  className?: string;

  /**
   * Custom class name for the popover content
   */
  popoverClassName?: string;

  /**
   * Custom class name for the trigger button
   */
  triggerClassName?: string;

  /**
   * Position of the popover
   * @default "bottom"
   */
  position?: "top" | "bottom" | "left" | "right";

  /**
   * Show selected options as badges (only applies when multiple=true)
   * @default false
   */
  showBadges?: boolean;

  /**
   * Allow clearing the selection
   * @default true
   */
  clearable?: boolean;

  /**
   * Custom render function for each option
   */
  renderOption?: (option: CategoryOption, isSelected: boolean) => ReactNode;

  /**
   * Required field validation
   * @default false
   */
  required?: boolean;

  /**
   * Error message to display when validation fails
   */
  errorMessage?: string;

  /**
   * ID for the input element
   */
  id?: string;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * Callback fired when the combobox is focused
   */
  onFocus?: () => void;

  /**
   * Callback fired when the combobox loses focus
   */
  onBlur?: () => void;

  /**
   * Virtualize the dropdown list for better performance with large datasets
   * @default false
   */
  virtualized?: boolean;

  /**
   * Number of items to render in the virtualized list
   * @default 10
   */
  virtualizedItemCount?: number;
}

/**
 * Context type for the CategoryCombobox component
 */
export interface CategoryComboboxContextType {
  selectedValues: string[];
  searchQuery: string;
  isOpen: boolean;
  setSearchQuery: (query: string) => void;
  handleSelect: (value: string) => void;
  handleClear: (e: React.MouseEvent) => void;
  handleOpenChange: (open: boolean) => void;
  loading: boolean;
  disabled: boolean;
  multiple: boolean;
  clearable: boolean;
  showBadges: boolean;
  placeholder: string;
  emptyMessage: string;
  maxHeight: number;
  renderOption?: (option: CategoryOption, isSelected: boolean) => ReactNode;
  filteredOptions: CategoryOption[];
  selectedOptions: CategoryOption[];
  isSelected: (value: string) => boolean;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  // Add these for hierarchical navigation
  isHierarchical: boolean;
  currentLevel: CategoryLevel[];
  setCurrentLevel: (level: CategoryLevel[]) => void;
  handleLevelUp: () => void;
  handleLevelDown: (option: CategoryOption) => void;
  getCurrentLevelOptions: () => CategoryOption[];
  // Animation states
  navigationDirection: "forward" | "backward" | null;
  isNavigating: boolean;
}
