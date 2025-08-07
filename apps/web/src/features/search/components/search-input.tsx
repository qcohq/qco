"use client";

import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
    showClearButton?: boolean;
    autoFocus?: boolean;
}

export function SearchInput({
    placeholder = "Поиск товаров...",
    className = "",
    onSearch,
    showClearButton = true,
    autoFocus = false,
}: SearchInputProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const trpc = useTRPC();

    const debouncedQuery = useDebounce(query, 300);

    // Создаем опции запроса для автодополнения
    const autocompleteQueryOptions = trpc.search.autocomplete.queryOptions({
        query: debouncedQuery
    });

    // Получаем автодополнение
    const { data: autocompleteData } = useQuery({
        ...autocompleteQueryOptions,
        enabled: debouncedQuery.length > 0,
        staleTime: 30000, // 30 секунд
    });

    const suggestions = autocompleteData?.suggestions || [];

    // Обработка поиска
    const handleSearch = useCallback(
        (searchQuery: string) => {
            if (searchQuery.trim()) {
                if (onSearch) {
                    onSearch(searchQuery.trim());
                } else {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
                setIsOpen(false);
                setQuery("");
            }
        },
        [onSearch, router]
    );

    // Обработка клавиатуры
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                handleSearch(suggestions[selectedIndex].value);
            } else {
                handleSearch(query);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setSelectedIndex(-1);
        }
    };

    // Обработка клика вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Обработка изменения запроса
    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length > 0);
        setSelectedIndex(-1);
    };

    // Очистка запроса
    const clearQuery = () => {
        setQuery("");
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
    };

    // Обработка клика по подсказке
    const handleSuggestionClick = (suggestion: { value: string }) => {
        handleSearch(suggestion.value);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(query.length > 0)}
                    autoFocus={autoFocus}
                    className="pl-10 pr-10"
                />
                {showClearButton && query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                        onClick={clearQuery}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Подсказки */}
            {isOpen && suggestions.length > 0 && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg"
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.type}-${suggestion.value}`}
                            type="button"
                            className={`flex w-full items-center justify-between px-4 py-2 text-left hover:bg-gray-50 ${index === selectedIndex ? "bg-gray-50" : ""
                                }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <div className="flex items-center gap-2">
                                <Search className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">{suggestion.text}</span>
                            </div>
                            {suggestion.count && (
                                <span className="text-xs text-gray-500">
                                    {suggestion.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 