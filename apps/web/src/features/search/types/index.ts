export interface SearchFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "relevance" | "price_asc" | "price_desc" | "newest" | "popular";
}

export interface SearchResult {
    id: string;
    name: string;
    slug: string;
    brand: {
        id: string;
        name: string;
        slug: string;
    };
    price: number;
    originalPrice?: number;
    discount?: number;
    image?: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    isNew?: boolean;
    isSale?: boolean;
}

export interface SearchResponse {
    products: SearchResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PopularSearch {
    query: string;
    count: number;
}

export interface AutocompleteSuggestion {
    type: "product" | "brand" | "category";
    text: string;
    value: string;
    count?: number;
} 