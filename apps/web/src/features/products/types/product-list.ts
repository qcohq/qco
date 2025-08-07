export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  salePrice?: number | null;
  onSale: boolean;
  image?: string;
  images?: string[];
  brand: string;
  inStock: boolean;
  category?: string;
  isNew?: boolean;
  rating?: number;
}
