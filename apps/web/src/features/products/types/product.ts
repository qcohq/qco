// Простой интерфейс для продукта на фронтенде
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number | null;
  salePrice: number | null;
  onSale: boolean;
  image: string | null;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    type: string;
    order: number;
  }>;
  category: string | null;
  brand: string | null;
  brandSlug: string | null;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  sku: string | null;
  stock: number | null;
  discountPercent: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Дополнительные поля для фронтенда
  rating: number;
  details: string[];

  // Атрибуты продукта
  sizes: Array<{ name: string; value: string; inStock: boolean } | string>;
  colors: Array<{ name: string; value: string; hex: string } | string>;

  // Дополнительные поля из API
  variants: Array<{
    id: string;
    name: string;
    sku: string | null;
    barcode: string | null;
    price: number;
    salePrice: number | null;
    costPrice: number | null;
    stock: number;
    minStock: number;
    weight: number | null;
    width: number | null;
    height: number | null;
    depth: number | null;
    isActive: boolean;
    isDefault: boolean;
    options?: Array<{
      option: string;
      value: string;
      metadata?: any;
    }>;
  }>;
  tags: string[];
  features: string[];
  attributes: Record<string, string>;
  relatedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    basePrice: number | null;
    salePrice: number | null;
  }>;
}

// Функция для преобразования данных API в Product
export function transformProductDetail(productData: any): Product {
  return {
    ...productData,
    onSale:
      productData.salePrice !== null &&
      productData.salePrice < (productData.basePrice || 0),
    details: productData.features || [],
    rating: 0, // По умолчанию
    reviewCount: 0, // По умолчанию
  };
}
