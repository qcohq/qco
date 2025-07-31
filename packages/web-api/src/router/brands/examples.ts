/**
 * Примеры использования API брендов
 * 
 * Этот файл содержит примеры вызовов API для работы с брендами.
 * Используйте эти примеры для тестирования и понимания API.
 */

// Пример 1: Получение всех брендов (первая страница)
export const getAllBrandsExample = `
const result = await trpc.brands.getAll.query();
console.log('Все бренды:', result.brands);
console.log('Пагинация:', result.pagination);
`;

// Пример 2: Получение брендов с поиском
export const searchBrandsExample = `
const result = await trpc.brands.getAll.query({
  search: "Nike",
  limit: 10
});
console.log('Найденные бренды:', result.brands);
`;

// Пример 3: Получение только избранных брендов
export const featuredBrandsExample = `
const result = await trpc.brands.getAll.query({
  featured: true,
  sortBy: "isFeatured",
  sortOrder: "desc"
});
console.log('Избранные бренды:', result.brands);
`;

// Пример 4: Пагинация
export const paginationExample = `
const result = await trpc.brands.getAll.query({
  page: 2,
  limit: 5
});
console.log('Страница 2:', result.brands);
console.log('Всего страниц:', result.pagination.totalPages);
`;

// Пример 5: Получение избранных брендов для главной страницы
export const getFeaturedExample = `
const featuredBrands = await trpc.brands.getFeatured.query({
  limit: 6
});
console.log('Избранные бренды для главной:', featuredBrands);
`;

// Пример 6: Сортировка по дате создания
export const sortByDateExample = `
const result = await trpc.brands.getAll.query({
  sortBy: "createdAt",
  sortOrder: "desc"
});
console.log('Новые бренды:', result.brands);
`;

// Пример 7: Комбинированный поиск
export const combinedSearchExample = `
const result = await trpc.brands.getAll.query({
  search: "sport",
  featured: true,
  sortBy: "name",
  sortOrder: "asc",
  limit: 15
});
console.log('Спортивные избранные бренды:', result.brands);
`; 
