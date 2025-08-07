"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import type { CatalogFilters } from "../types/catalog";

const initialFilters: CatalogFilters = {
  brands: [],
  priceRange: [0, 500000],
  sizes: [],
  colors: [],
  categories: [],
  inStock: false,
};

export function useCatalogFilters(
  category?: string,
  subcategory?: string,
  searchQuery?: string,
) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Filter by subcategory
    if (subcategory) {
      filtered = filtered.filter((product) =>
        product.subcategory.toLowerCase().includes(subcategory.toLowerCase()),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    // Apply filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand.toLowerCase()),
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
      filtered = filtered.filter(
        (product) =>
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1],
      );
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size)),
      );
    }

    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.colors.some((color) => product.colors?.includes(color)),
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock !== false);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [category, subcategory, searchQuery, filters, sortBy]);

  const updateFilter = (filterType: keyof CatalogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const removeFilter = (filterType: keyof CatalogFilters, value: string) => {
    if (filterType === "priceRange") {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, 500000],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterType]: (prev[filterType] as string[]).filter(
          (item) => item !== value,
        ),
      }));
    }
  };

  return {
    filters,
    sortBy,
    setSortBy,
    filteredProducts,
    updateFilter,
    clearFilters,
    removeFilter,
  };
}
