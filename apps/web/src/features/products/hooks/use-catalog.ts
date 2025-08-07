"use client";

import { useMemo, useState } from "react";
import { catalogProducts } from "@/data/catalog-data";
import type { CatalogFilters } from "../types/catalog";

const initialFilters: CatalogFilters = {
  brands: [],
  priceRange: [0, 1000000],
  sizes: [],
  colors: [],
  categories: [],
  inStock: false,
  onSale: false,
};

export function useCatalog(
  category?: string,
  subcategory?: string,
  subsubcategory?: string,
) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [sortBy, setSortBy] = useState("newest");

  // Filter products based on URL parameters and filters
  const filteredProducts = useMemo(() => {
    let filtered = [...catalogProducts];

    // Filter by URL parameters
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }
    if (subcategory) {
      filtered = filtered.filter(
        (product) => product.subcategory === subcategory,
      );
    }
    if (subsubcategory) {
      filtered = filtered.filter(
        (product) => product.subsubcategory === subsubcategory,
      );
    }

    // Apply user filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand.toLowerCase()),
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
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
      filtered = filtered.filter(
        (product) =>
          product.colors &&
          product.colors.some((color) => filters.colors.includes(color)),
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter((product) => product.inStock !== false);
    }

    if (filters.onSale) {
      filtered = filtered.filter((product) => product.isOnSale === true);
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
  }, [category, subcategory, subsubcategory, filters, sortBy]);

  const updateFilter = (filterType: keyof CatalogFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const removeFilter = (filterType: keyof CatalogFilters, value?: string) => {
    if (filterType === "priceRange") {
      setFilters((prev) => ({ ...prev, priceRange: [0, 1000000] }));
    } else if (filterType === "inStock" || filterType === "onSale") {
      setFilters((prev) => ({ ...prev, [filterType]: false }));
    } else if (value) {
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
