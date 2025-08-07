import { Skeleton } from "@qco/ui/components/skeleton";
import Link from "next/link";
import { useCategoryMenu } from "../hooks/use-categories";

export function CategoryMenu() {
  const { data: categories, isLoading, error } = useCategoryMenu();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={`category-menu-skeleton-${i}`} className="h-4 w-24" />
        ))}
      </div>
    );
  }

  if (error || !categories) {
    return null;
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
