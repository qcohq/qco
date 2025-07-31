import { Suspense } from "react";
import { CategoriesList } from "~/features/categories/categories-list";
import { CategoriesLoading } from "~/features/categories/categories-loading";
export const metadata = {
  title: "Категории | QCO",
  description: "Управление категориями товаров",
};

export default function CategoriesPage() {
  return (
    <div className="w-full max-w-none px-0 sm:px-2 md:px-6 xl:px-12 py-6">
      <Suspense fallback={<CategoriesLoading />}>
        <CategoriesList />
      </Suspense>
    </div>
  );
}
