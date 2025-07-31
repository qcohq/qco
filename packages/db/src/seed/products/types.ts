/**
 * Типы данных для импорта продуктов
 */

/**
 * Структура данных продукта из JSON-файла
 */
export interface ProductData {
  productId: string;
  xmlId: string;
  name: string;
  categoryIds?: string[];
  brand?: string;
  link: string;
  // Новое поле для изображений в формате новых JSON-файлов
  images?: string[];
  // Старое поле для совместимости
  media?: {
    type: string;
    src: string;
    content?: {
      source?: string;
      default?: {
        jpg?: {
          src: string;
        };
        webp?: {
          src: string;
        };
      };
    };
  }[];
  // Информация о ценах
  price?: number;
  priceDiscount?: number;
  discount?: number;
  // Информация о цветах
  colors?: {
    id: string;
    xmlId: string;
    name: string;
    hex: string;
    multi?: { name: string; hex: string }[];
    link: string;
    checked: boolean;
  }[];
  // Информация о размерах
  sizes?: {
    id: string;
    xmlId: string;
    main: string;
    second?: string;
    available: boolean;
    offline: boolean;
    online: boolean;
    price: number;
    priceDiscount: number;
    discount: number;
  }[];
  // Варианты продукта
  variants?: {
    sku?: string;
    name?: string;
    barcode?: string;
    isDefault?: boolean;
    stock?: number;
    minStock?: number;
    isActive?: boolean;
    price?: number;
    salePrice?: number;
    costPrice?: number;
    weight?: number;
    width?: number;
    height?: number;
    depth?: number;
    // Атрибуты варианта
    attributes?: {
      name: string; // Название атрибута (например, "Цвет")
      value: string; // Значение атрибута (например, "Красный")
    }[];
  }[];
  // Атрибуты продукта
  attributes?: {
    name: string;
    slug?: string;
    description?: string;
    type: string; // text, number, select, boolean, color
    required?: boolean;
    options?: { label: string; value: string; metadata?: { hex?: string } }[];
  }[];
}

/**
 * Информация о файле после загрузки в S3
 */
export interface FileInfo {
  fileId: string;
  url: string;
  size: number;
  mimeType: string;
  name: string;
}
