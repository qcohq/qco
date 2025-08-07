"use client";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productsCount?: number;
  order?: number | null;
  isActive?: boolean;
  isFeatured?: boolean;
  children?: CategoryTree[];
}

interface CategoryTreeItemProps {
  category: CategoryTree;
  level?: number;
  onClose?: () => void;
}

export function CategoryTreeItem({
  category,
  level = 0,
  onClose,
}: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const paddingLeft = level * 16; // 16px отступ для каждого уровня

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCategoryClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div>
      <div
        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <div className="flex items-center gap-3 flex-1">
          {hasChildren && (
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          <Link
            href={`/catalog/${category.slug}`}
            onClick={handleCategoryClick}
            className="flex items-center gap-3 flex-1 hover:text-blue-600 transition-colors"
          >
            <span className="text-sm font-medium">{category.name}</span>
            {category.productsCount && category.productsCount > 0 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                {category.productsCount}
              </span>
            )}
          </Link>
        </div>

        {category.isFeatured && (
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
            HOT
          </span>
        )}
      </div>

      {hasChildren && isExpanded && category.children && (
        <div className="border-l border-gray-200 ml-4">
          {category.children.map((child: CategoryTree) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}
