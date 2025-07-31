import type {
  BlogPostStatus,
  BlogPostType,
  BlogPostVisibility,
} from "../types";

// Форматирование даты
export function formatBlogDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Форматирование даты и времени
export function formatBlogDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Получение конфигурации статуса
export function getBlogPostStatusConfig(status: BlogPostStatus) {
  const statusConfig = {
    draft: {
      variant: "secondary" as const,
      label: "Черновик",
      color: "text-muted-foreground",
    },
    published: {
      variant: "default" as const,
      label: "Опубликовано",
      color: "text-green-600",
    },
    scheduled: {
      variant: "outline" as const,
      label: "Запланировано",
      color: "text-blue-600",
    },
    archived: {
      variant: "destructive" as const,
      label: "В архиве",
      color: "text-red-600",
    },
  };

  return statusConfig[status] || statusConfig.draft;
}

// Получение конфигурации типа
export function getBlogPostTypeConfig(type: BlogPostType) {
  const typeConfig = {
    post: {
      variant: "secondary" as const,
      label: "Запись",
      color: "text-blue-600",
    },
    page: {
      variant: "outline" as const,
      label: "Страница",
      color: "text-purple-600",
    },
  };

  return typeConfig[type] || typeConfig.post;
}

// Получение конфигурации видимости
export function getBlogPostVisibilityConfig(visibility: BlogPostVisibility) {
  const visibilityConfig = {
    public: { label: "Публичная", color: "text-green-600" },
    members: { label: "Для участников", color: "text-blue-600" },
    paid: { label: "Платная", color: "text-orange-600" },
    private: { label: "Приватная", color: "text-red-600" },
  };

  return visibilityConfig[visibility] || visibilityConfig.public;
}

// Генерация slug из заголовка
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Обрезка текста
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

// Извлечение мета-описания из контента
export function extractMetaDescription(
  content: string,
  maxLength = 160,
): string {
  // Удаляем HTML теги
  const plainText = content.replace(/<[^>]*>/g, "");
  // Удаляем лишние пробелы
  const cleanText = plainText.replace(/\s+/g, " ").trim();
  return truncateText(cleanText, maxLength);
}

// Проверка, является ли пост опубликованным
export function isPostPublished(
  status: BlogPostStatus,
  publishedAt?: Date,
): boolean {
  if (status !== "published") return false;
  if (!publishedAt) return false;
  return new Date(publishedAt) <= new Date();
}

// Проверка, является ли пост запланированным
export function isPostScheduled(
  status: BlogPostStatus,
  scheduledAt?: Date,
): boolean {
  if (status !== "scheduled") return false;
  if (!scheduledAt) return false;
  return new Date(scheduledAt) > new Date();
}

// Получение статуса поста для отображения
export function getPostDisplayStatus(
  status: BlogPostStatus,
  publishedAt?: Date,
  scheduledAt?: Date,
): BlogPostStatus {
  if (
    status === "published" &&
    publishedAt &&
    new Date(publishedAt) > new Date()
  ) {
    return "scheduled";
  }
  if (
    status === "scheduled" &&
    scheduledAt &&
    new Date(scheduledAt) <= new Date()
  ) {
    return "published";
  }
  return status;
}
