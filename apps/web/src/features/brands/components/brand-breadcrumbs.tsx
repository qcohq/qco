"use client";

import Breadcrumbs, { type BreadcrumbItem } from "@/components/breadcrumbs";
import { useBrand } from "../hooks/use-brand";

interface BrandBreadcrumbsProps {
    slug: string;
}

export function BrandBreadcrumbs({ slug }: BrandBreadcrumbsProps) {
    const { brand, isLoading, error } = useBrand(slug);

    // Создаем хлебные крошки для состояния загрузки
    const getLoadingBreadcrumbItems = (): BreadcrumbItem[] => [
        { label: "Главная", href: "/" },
        { label: "Бренды", href: "/brands" },
        { label: "Загрузка...", href: undefined },
    ];

    // Создаем хлебные крошки с названием бренда
    const getBreadcrumbItems = (): BreadcrumbItem[] => [
        { label: "Главная", href: "/" },
        { label: "Бренды", href: "/brands" },
        { label: brand?.name || slug, href: `/brands/${slug}` },
    ];

    // Если есть ошибка, показываем slug как fallback
    const getErrorBreadcrumbItems = (): BreadcrumbItem[] => [
        { label: "Главная", href: "/" },
        { label: "Бренды", href: "/brands" },
        { label: slug, href: `/brands/${slug}` },
    ];

    return (
        <Breadcrumbs
            items={
                isLoading
                    ? getLoadingBreadcrumbItems()
                    : error
                        ? getErrorBreadcrumbItems()
                        : getBreadcrumbItems()
            }
        />
    );
} 