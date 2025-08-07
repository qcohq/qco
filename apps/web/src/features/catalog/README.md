# Catalog Feature

Модуль каталога товаров для e-commerce платформы. Обеспечивает отображение категорий, брендов, баннеров и новинок.

## Структура

```
catalog/
├── components/
│   ├── catalog-header.tsx      # Заголовок с поиском и фильтрами
│   ├── catalog-banners.tsx     # Баннеры каталога
│   ├── catalog-categories.tsx  # Список категорий
│   ├── catalog-brands.tsx      # Список брендов
│   ├── catalog-new-products.tsx # Секция новинок
│   ├── catalog-loading.tsx     # Компонент загрузки
│   └── index.ts                # Экспорты компонентов
├── hooks/
│   └── use-catalog-data.ts     # Хук для получения данных каталога
├── types/
│   └── index.ts                # Типы для каталога
└── README.md                   # Документация
```

## Компоненты

### CatalogHeader
Заголовок страницы с поиском и кнопкой фильтров.

### CatalogBanners
Отображает баннеры для каталога. Использует валидатор `BannersList` из `@qco/web-validators`.

### CatalogCategories
Список корневых категорий товаров. Использует валидатор `GetAllCategoriesResponse` из `@qco/web-validators`.

### CatalogBrands
Список избранных брендов. Использует валидатор `FeaturedBrandsList` из `@qco/web-validators`.

### CatalogNewProducts
Секция новинок с примером товара и кнопкой добавления в корзину.

### CatalogLoading
Компонент состояния загрузки.

## Хуки

### useCatalogData
Хук для получения всех данных каталога:
- Категории (корневые)
- Избранные бренды
- Баннеры для позиции "catalog"

Возвращает типизированный объект `CatalogDataState`.

## Типы

Все типы импортируются из `@qco/web-validators` для обеспечения консистентности между фронтендом и бэкендом.

## Использование

```tsx
import { useCatalogData } from "@/features/catalog/hooks/use-catalog-data";
import { CatalogHeader, CatalogBanners } from "@/features/catalog/components";

export function CatalogPage() {
  const { categories, brands, banners, isLoading } = useCatalogData();
  
  if (isLoading) return <CatalogLoading />;
  
  return (
    <div>
      <CatalogHeader />
      <CatalogBanners banners={banners || []} />
      {/* ... */}
    </div>
  );
}
```

## API Endpoints

- `categories.getRoot` - получение корневых категорий
- `brands.getFeatured` - получение избранных брендов
- `banners.getByPosition` - получение баннеров по позиции

Все эндпоинты используют валидаторы из `@qco/web-validators` для обеспечения типобезопасности. 