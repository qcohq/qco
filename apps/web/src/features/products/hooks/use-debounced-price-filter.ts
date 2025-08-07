"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@qco/ui/hooks/use-debounce";

interface UseDebouncedPriceFilterProps {
    initialPriceRange: [number, number];
    onPriceChange: (priceRange: [number, number]) => void;
    debounceDelay?: number;
}

export function useDebouncedPriceFilter({
    initialPriceRange,
    onPriceChange,
    debounceDelay = 800,
}: UseDebouncedPriceFilterProps) {
    // Локальное состояние для ползунка
    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(initialPriceRange);

    // Состояние для индикации задержки
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Состояние для отслеживания изменений в input полях
    const [inputValues, setInputValues] = useState<[string, string]>([
        initialPriceRange[0].toString(),
        initialPriceRange[1].toString()
    ]);

    // Дебаунсированное значение (только для ползунка)
    const debouncedPriceRange = useDebounce(localPriceRange, debounceDelay);

    // Синхронизируем локальное состояние с внешним
    useEffect(() => {
        setLocalPriceRange(initialPriceRange);
        setInputValues([
            initialPriceRange[0].toString(),
            initialPriceRange[1].toString()
        ]);
    }, [initialPriceRange]);

    // Отслеживаем изменения локального значения для индикации задержки (только для ползунка)
    useEffect(() => {
        const isLocalDifferent =
            localPriceRange[0] !== initialPriceRange[0] ||
            localPriceRange[1] !== initialPriceRange[1];

        setIsDebouncing(isLocalDifferent);
    }, [localPriceRange, initialPriceRange]);

    // Применяем дебаунсированные значения (только для ползунка)
    useEffect(() => {
        if (
            debouncedPriceRange[0] !== initialPriceRange[0] ||
            debouncedPriceRange[1] !== initialPriceRange[1]
        ) {
            onPriceChange(debouncedPriceRange);
        }
    }, [debouncedPriceRange, onPriceChange, initialPriceRange]);

    // Функция для изменения ползунка
    const handleSliderChange = useCallback((value: number[]) => {
        if (value.length === 2) {
            setLocalPriceRange([value[0], value[1]]);
            setInputValues([value[0].toString(), value[1].toString()]);
        }
    }, []);

    // Функция для изменения минимальной цены в input
    const handleMinPriceInputChange = useCallback((value: string) => {
        setInputValues([value, inputValues[1]]);
    }, [inputValues[1]]);

    // Функция для изменения максимальной цены в input
    const handleMaxPriceInputChange = useCallback((value: string) => {
        setInputValues([inputValues[0], value]);
    }, [inputValues[0]]);

    // Функция для применения изменений при потере фокуса
    const handleMinPriceBlur = useCallback(() => {
        const minValue = Number.parseInt(inputValues[0]) || 0;
        const maxValue = Number.parseInt(inputValues[1]) || 0;

        if (minValue <= maxValue) {
            const newRange: [number, number] = [minValue, maxValue];
            setLocalPriceRange(newRange);
            onPriceChange(newRange);
        } else {
            // Если значения некорректны, возвращаем к предыдущему состоянию
            setInputValues([
                localPriceRange[0].toString(),
                localPriceRange[1].toString()
            ]);
        }
    }, [inputValues, localPriceRange, onPriceChange]);

    const handleMaxPriceBlur = useCallback(() => {
        const minValue = Number.parseInt(inputValues[0]) || 0;
        const maxValue = Number.parseInt(inputValues[1]) || 0;

        if (minValue <= maxValue) {
            const newRange: [number, number] = [minValue, maxValue];
            setLocalPriceRange(newRange);
            onPriceChange(newRange);
        } else {
            // Если значения некорректны, возвращаем к предыдущему состоянию
            setInputValues([
                localPriceRange[0].toString(),
                localPriceRange[1].toString()
            ]);
        }
    }, [inputValues, localPriceRange, onPriceChange]);

    return {
        localPriceRange,
        inputValues,
        isDebouncing,
        handleSliderChange,
        handleMinPriceInputChange,
        handleMaxPriceInputChange,
        handleMinPriceBlur,
        handleMaxPriceBlur,
    };
} 