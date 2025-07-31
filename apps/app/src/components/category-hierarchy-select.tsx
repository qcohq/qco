"use client";

import { ChevronRight, ChevronDown, Check } from "lucide-react";
import * as React from "react";
import { Button } from "@qco/ui/components/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@qco/ui/components/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@qco/ui/components/popover";
import { cn } from "@qco/ui/lib/utils";
import { Badge } from "@qco/ui/components/badge";

interface CategoryItem {
    id: string;
    name: string;
    children?: CategoryItem[];
    hasChildren?: boolean;
}

interface CategoryHierarchySelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    categories: CategoryItem[];
    placeholder?: string;
    multiple?: boolean;
    showBadges?: boolean;
}

// Функция для подсветки найденного текста
function HighlightText({ text, searchQuery }: { text: string; searchQuery: string }) {
    if (!searchQuery) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
        <span>
            {parts.map((part, index) => {
                const isHighlighted = part.toLowerCase() === searchQuery.toLowerCase();
                const uniqueKey = `${text}-${part}-${index}`;

                return isHighlighted ? (
                    <mark key={uniqueKey} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
                        {part}
                    </mark>
                ) : (
                    <span key={uniqueKey}>{part}</span>
                );
            })}
        </span>
    );
}

// Функция для рекурсивного рендеринга категорий в CommandItem
function renderCategoryItems(
    categories: CategoryItem[],
    level: number,
    selectedValues: string[],
    expandedCategories: Set<string>,
    onToggle: (categoryId: string) => void,
    onSelect: (categoryId: string) => void,
    multiple: boolean,
    searchQuery: string
): React.ReactNode[] {
    return categories.map((category) => {
        const isExpanded = expandedCategories.has(category.id);
        const hasChildren = category.children && category.children.length > 0;
        const isSelected = selectedValues.includes(category.id);

        return (
            <React.Fragment key={category.id}>
                <CommandItem
                    value={category.id}
                    onSelect={() => onSelect(category.id)}
                    className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-sm rounded-sm cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground"
                    )}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                >
                    <div className="flex items-center gap-2 flex-1">
                        {multiple && (
                            <Check
                                className={cn(
                                    "h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                )}
                            />
                        )}
                        <span className="flex-1">
                            <HighlightText text={category.name} searchQuery={searchQuery} />
                        </span>
                    </div>

                    {hasChildren && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggle(category.id);
                            }}
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-3 w-3" />
                            ) : (
                                <ChevronRight className="h-3 w-3" />
                            )}
                        </Button>
                    )}
                </CommandItem>

                {hasChildren && isExpanded && category.children && (
                    renderCategoryItems(
                        category.children,
                        level + 1,
                        selectedValues,
                        expandedCategories,
                        onToggle,
                        onSelect,
                        multiple,
                        searchQuery
                    )
                )}
            </React.Fragment>
        );
    });
}

export function CategoryHierarchySelect({
    value,
    onChange,
    categories,
    placeholder = "Выберите категории...",
    multiple = false,
    showBadges = false,
}: CategoryHierarchySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
        new Set()
    );

    // Функция для переключения состояния развернутости категории
    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Функция для выбора категории
    const handleSelectCategory = (categoryId: string) => {
        if (multiple) {
            const newValue = value.includes(categoryId)
                ? value.filter((id) => id !== categoryId)
                : [...value, categoryId];
            onChange(newValue);
        } else {
            onChange([categoryId]);
            setOpen(false);
        }
    };

    // Функция для получения названий выбранных категорий
    const getSelectedCategoryNames = () => {
        if (!value.length) return placeholder;

        const flattenCategories = (cats: CategoryItem[]): CategoryItem[] => {
            let result: CategoryItem[] = [];
            for (const cat of cats) {
                result.push(cat);
                if (cat.children) {
                    result = result.concat(flattenCategories(cat.children));
                }
            }
            return result;
        };

        const allCategories = flattenCategories(categories);
        const selectedCategories = allCategories.filter((cat) =>
            value.includes(cat.id)
        );

        if (selectedCategories.length === 1) {
            return selectedCategories[0]?.name || placeholder;
        }

        if (showBadges) {
            return (
                <div className="flex flex-wrap gap-1">
                    {selectedCategories.map((cat) => (
                        <Badge key={cat.id} variant="secondary" className="text-xs">
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            );
        }

        return `${selectedCategories.length} категорий выбрано`;
    };

    // Улучшенная фильтрация категорий по поисковому запросу
    const filteredCategories = React.useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const searchLower = searchQuery.toLowerCase().trim();

        // Функция для фильтрации категорий с сохранением иерархии
        const filterCategories = (cats: CategoryItem[]): CategoryItem[] => {
            return cats
                .map((cat) => {
                    const nameMatches = cat.name.toLowerCase().includes(searchLower);
                    const children = cat.children ? filterCategories(cat.children) : [];

                    if (nameMatches || children.length > 0) {
                        return {
                            ...cat,
                            children: children.length > 0 ? children : undefined,
                        };
                    }
                    return null;
                })
                .filter((cat): cat is NonNullable<typeof cat> => cat !== null);
        };

        return filterCategories(categories);
    }, [categories, searchQuery]);

    // Автоматически разворачиваем категории при поиске
    React.useEffect(() => {
        if (searchQuery.trim()) {
            const expandCategoriesForSearch = (cats: CategoryItem[]): Set<string> => {
                const expanded = new Set<string>();

                const traverse = (categories: CategoryItem[]) => {
                    categories.forEach(cat => {
                        const nameMatches = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
                        const hasMatchingChildren = cat.children?.some(child =>
                            child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            child.children?.some(grandChild =>
                                grandChild.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                        );

                        if (nameMatches || hasMatchingChildren) {
                            expanded.add(cat.id);
                            if (cat.children) {
                                traverse(cat.children);
                            }
                        }
                    });
                };

                traverse(cats);
                return expanded;
            };

            setExpandedCategories(expandCategoriesForSearch(categories));
        } else {
            setExpandedCategories(new Set());
        }
    }, [searchQuery, categories]);

    // Обработчик изменения поискового запроса
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-10"
                // biome-ignore lint/a11y/useSemanticElements: Кастомный combobox компонент
                >
                    <div className="flex-1 text-left">
                        {getSelectedCategoryNames()}
                    </div>
                    <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Поиск категории..."
                        value={searchQuery}
                        onValueChange={handleSearchChange}
                    />
                    <CommandEmpty>Категории не найдены</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {renderCategoryItems(
                            filteredCategories,
                            0,
                            value,
                            expandedCategories,
                            toggleCategory,
                            handleSelectCategory,
                            multiple,
                            searchQuery
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 