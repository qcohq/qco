import type { NavItemSchema } from "@qco/web-validators";
import type { z } from "zod";

export type NavItem = z.infer<typeof NavItemSchema>;

export interface SubcategoryGroup {
  title: string;
  items: {
    title: string;
    href: string;
    description?: string;
  }[];
}

export interface FeaturedItem {
  title: string;
  href: string;
  image: string;
}



// Типы для продуктов с отношениями
export interface ProductWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  stock: number | null;
  createdAt: Date;
  files?: {
    type: string;
    file?: {
      meta?: {
        url?: string;
      };
    };
  }[];
  categories?: {
    category?: {
      name: string;
    };
  }[];
  brand?: {
    name: string;
  };
}
