"use server";

import type { CreateProductFormValues } from "@/types/product";

// Функция для создания нового продукта
export async function createProduct(data: CreateProductFormValues) {
  try {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Проверка наличия необходимых данных
    if (!data.name) {
      return {
        success: false,
        error: "Название товара обязательно",
      };
    }

    // Здесь будет логика создания продукта в базе данных
    // Для демонстрации просто возвращаем успешный результат с данными

    return {
      success: true,
      product: {
        id: `prod-${Math.floor(Math.random() * 1000)}`,
        ...data,
      },
    };
  } catch (error) {
    console.error("Ошибка при создании продукта:", error);
    return {
      success: false,
      error: "Произошла ошибка при создании продукта",
    };
  }
}

// Функция для массового удаления продуктов
export async function bulkDeleteProducts(productIds: string[]) {
  try {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Проверка наличия ID продуктов
    if (!productIds || productIds.length === 0) {
      return {
        success: false,
        error: "Не выбраны продукты для удаления",
      };
    }

    // Здесь будет логика массового удаления продуктов из базы данных
    // Для демонстрации просто возвращаем успешный результат

    return {
      success: true,
      productIds,
    };
  } catch (error) {
    console.error("Ошибка при массовом удалении продуктов:", error);
    return {
      success: false,
      error: "Произошла ошибка при массовом удалении продуктов",
    };
  }
}

// Функция для генерации описания товара
export async function generateProductDescription(data: {
  name: string;
  category?: string;
  features?: string[];
}) {
  try {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Проверка наличия необходимых данных
    if (!data.name) {
      return {
        success: false,
        error: "Название товара обязательно для генерации описания",
      };
    }

    // Генерация описания на основе предоставленных данных
    let description = `${data.name} - отличный выбор для тех, кто ценит качество и стиль. `;

    if (data.category) {
      description += `Этот товар относится к категории "${data.category}" и обладает всеми необходимыми характеристиками. `;
    }

    if (data.features && data.features.length > 0) {
      description += `Особенности товара: ${data.features.join(", ")}. `;
    }

    description +=
      "Изготовлен из высококачественных материалов, обеспечивающих долговечность и надежность. Приобретая этот товар, вы получаете оптимальное сочетание цены и качества.";

    return {
      success: true,
      description,
    };
  } catch (error) {
    console.error("Ошибка при генерации описания:", error);
    return {
      success: false,
      error: "Произошла ошибка при генерации описания",
    };
  }
}

// Функция для генерации SEO-контента
export async function generateSeoContent(data: {
  name: string;
  description: string;
  category?: string;
}) {
  try {
    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Проверка наличия необходимых данных
    if (!data.name || !data.description) {
      return {
        success: false,
        error:
          "Название и описание товара обязательны для генерации SEO-контента",
      };
    }

    // Генерация SEO-заголовка
    const title = `Купить ${data.name} ${data.category ? `в категории ${data.category}` : ""} по выгодной цене`;

    // Генерация SEO-описания
    const shortDescription =
      data.description.length > 120
        ? `${data.description.substring(0, 120)}...`
        : data.description;
    const description = `${shortDescription} ✓ Быстрая доставка ✓ Гарантия качества ✓ Лучшие цены.`;

    // Генерация URL-адреса
    const slug = data.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Генерация ключевых слов
    const keywords = `${data.name}, ${data.category || "товар"}, купить ${data.name}, цена`;

    return {
      success: true,
      seoContent: {
        title,
        description,
        slug,
        keywords,
      },
    };
  } catch (error) {
    console.error("Ошибка при генерации SEO-контента:", error);
    return {
      success: false,
      error: "Произошла ошибка при генерации SEO-контента",
    };
  }
}
