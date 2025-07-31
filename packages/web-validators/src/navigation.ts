import { z } from "zod";

export const FeaturedItemSchema = z.object({
  title: z.string().min(1),
  href: z.string().startsWith("/catalog/"),
  image: z.string().url(),
});

export const SubcategoryGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(
    z.object({
      title: z.string().min(1),
      href: z.string().startsWith("/catalog/"),
      description: z.string().optional(),
    }),
  ),
});

export const NavItemSchema = z.object({
  title: z.string().min(1),
  href: z.string().startsWith("/catalog/"),
  description: z.string().optional(),
  subcategories: z.array(SubcategoryGroupSchema).optional(),
  featured: z.array(FeaturedItemSchema).optional(),
});

export type NavItem = z.infer<typeof NavItemSchema>;
export type SubcategoryGroup = z.infer<typeof SubcategoryGroupSchema>;
export type FeaturedItem = z.infer<typeof FeaturedItemSchema>;
