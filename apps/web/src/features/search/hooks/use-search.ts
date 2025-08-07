"use client";

import { useState, useEffect } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 10;

export function useSearch() {
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const trpc = useTRPC();

    // Создаем опции запроса для популярных поисковых запросов
    const popularSearchesQueryOptions = trpc.search.getPopularSearches.queryOptions();

    // Получаем популярные поисковые запросы
    const { data: popularSearches } = useQuery({
        ...popularSearchesQueryOptions,
        staleTime: 300000, // 5 минут
    });

    // Загружаем историю поиска из localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                if (Array.isArray(parsed)) {
                    setSearchHistory(parsed);
                }
            } catch (error) {
                console.error("Failed to parse search history:", error);
            }
        }
    }, []);

    // Сохраняем историю поиска в localStorage
    const saveSearchHistory = (history: string[]) => {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    };

    // Добавляем поисковый запрос в историю
    const addToHistory = (query: string) => {
        if (!query.trim()) return;

        const trimmedQuery = query.trim();
        setSearchHistory((prev) => {
            // Удаляем дубликаты и добавляем новый запрос в начало
            const filtered = prev.filter((item) => item !== trimmedQuery);
            const newHistory = [trimmedQuery, ...filtered].slice(0, MAX_HISTORY_ITEMS);
            saveSearchHistory(newHistory);
            return newHistory;
        });
    };

    // Удаляем поисковый запрос из истории
    const removeFromHistory = (query: string) => {
        setSearchHistory((prev) => {
            const newHistory = prev.filter((item) => item !== query);
            saveSearchHistory(newHistory);
            return newHistory;
        });
    };

    // Очищаем всю историю поиска
    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    };

    return {
        searchHistory,
        popularSearches: popularSearches?.searches || [],
        addToHistory,
        removeFromHistory,
        clearHistory,
    };
} 