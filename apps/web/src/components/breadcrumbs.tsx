import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="container mx-auto px-3 sm:px-4">
      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 md:mb-6 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mt-2 sm:mt-2.5">
        {items.map((item, index) => (
          <div key={`breadcrumb-${index}-${item.label}`} className="flex items-center flex-shrink-0">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 flex-shrink-0" />
            )}
            {!item.href || index === items.length - 1 ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
