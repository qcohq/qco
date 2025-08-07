import type { CategoryType } from "../types";

interface SaleProductsHeaderProps {
    category: CategoryType;
}

export function SaleProductsHeader({ category }: SaleProductsHeaderProps) {
    const getCategoryTitle = (category: CategoryType) => {
        switch (category) {
            case "men":
                return "Sale для мужчин";
            case "women":
                return "Sale для женщин";
            case "kids":
                return "Sale для детей";
            default:
                return "Sale";
        }
    };

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{getCategoryTitle(category)}</h1>
            <p className="text-muted-foreground">
                Откройте для себя лучшие предложения и скидки на модную одежду
            </p>
        </div>
    );
} 