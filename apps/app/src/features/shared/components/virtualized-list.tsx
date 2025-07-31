"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  overscan?: number;
  getItemKey: (item: T) => string | number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  className = "",
  overscan = 3,
  getItemKey,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + clientHeight) / itemHeight) + overscan,
    );

    setVisibleRange({
      start: Math.max(0, startIndex - overscan),
      end: endIndex,
    });
  }, [itemHeight, items.length, overscan]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateVisibleRange();
    const handleScroll = () => {
      updateVisibleRange();
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [updateVisibleRange]);

  // Обновляем видимый диапазон при изменении списка элементов
  useEffect(() => {
    updateVisibleRange();
  }, [updateVisibleRange]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);

  return (
    <div ref={containerRef} className={`overflow-auto ${className}`}>
      <div
        style={{
          height: `${items.length * itemHeight}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${visibleRange.start * itemHeight}px`,
            width: "100%",
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={getItemKey(item)} style={{ height: `${itemHeight}px` }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
