"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const brandSections = [
  {
    title: "Для женщин",
    href: "/brands",
    slug: "zhenschinam",
  },
  {
    title: "Для мужчин",
    href: "/brands/men",
    slug: "muzhchinam",
  },
  {
    title: "Для детей",
    href: "/brands/kids",
    slug: "detyam",
  },
];

interface BrandsNavigationProps {
  className?: string;
}

export function BrandsNavigation({ className }: BrandsNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex space-x-1 bg-muted p-1 rounded-lg", className)}>
      {brandSections.map((section) => {
        const isActive = pathname === section.href;

        return (
          <Link
            key={section.href}
            href={section.href}
            className={cn(
              "flex-1 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
          >
            {section.title}
          </Link>
        );
      })}
    </nav>
  );
}
