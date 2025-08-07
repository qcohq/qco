import type { CategoryType } from "../types";

interface NewProductsHeaderProps {
  category: CategoryType;
}

export function NewProductsHeader({ category }: NewProductsHeaderProps) {
  const getCategoryTitle = (category: CategoryType) => {
    switch (category) {
      case "men":
        return "Новинки для мужчин";
      case "women":
        return "Новинки для женщин";
      case "kids":
        return "Новинки для детей";
      default:
        return "Новинки";
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{getCategoryTitle(category)}</h1>
      <p className="text-muted-foreground">
        Откройте для себя последние новинки в мире моды
      </p>
    </div>
  );
}
