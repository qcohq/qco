"use client";

import { Button } from "@qco/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { CategoryForm } from "@/features/categories/category-form";
import { CategoryFormSkeleton } from "@/features/categories/components/category-form-skeleton";
import { useCategoryCreation } from "@/features/categories/hooks/use-category-creation";

export function CreateCategoryPage() {
    const router = useRouter();
    const {
        categories,
        isCategoriesLoading,
        categoriesError,
        handleSubmit,
        // isCreating не используется в компоненте
    } = useCategoryCreation();

    if (isCategoriesLoading) {
        return <CategoryFormSkeleton />;
    }

    if (categoriesError) {
        return (
            <div className="text-destructive py-8 text-center text-sm">
                Ошибка загрузки категорий: {categoriesError.message}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/categories")}
                    className="gap-1 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Категории
                </Button>
                <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <span>/</span>
                    <span className="text-foreground font-medium">
                        Создание категории
                    </span>
                </div>
            </header>

            {/* Form */}
            <CategoryForm
                categories={categories}
                onSubmit={handleSubmit}
                isEditing={false}
            />
        </div>
    );
} 