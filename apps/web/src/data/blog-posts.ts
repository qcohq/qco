import type { BlogPost } from "@/types/blog";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Тренды осени 2025: Что будет в моде?",
    slug: "autumn-trends-2025",
    excerpt:
      "Откройте для себя главные модные тенденции предстоящего осеннего сезона. От цветовых палитр до ключевых силуэтов – будьте в курсе!",
    publishedAt: new Date("2025-06-19"),
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    createdAt: new Date("2025-06-19"),
    updatedAt: new Date("2025-06-19"),
    author: {
      id: "1",
      name: "Елена Модная",
      email: "elena@example.com",
    },
    featuredImage: {
      id: "1",
      url: "/placeholder.svg?width=800&height=500",
      name: "autumn-trends-2025.jpg",
    },
    tags: [
      { id: "1", name: "Тренды", slug: "trends", color: "#ff6b6b" },
      { id: "2", name: "Осень", slug: "autumn", color: "#4ecdc4" },
    ],
    categories: [
      {
        id: "1",
        name: "Мода",
        slug: "fashion",
        description: "Модные тренды и стиль",
      },
    ],
  },
  {
    id: "2",
    title: "Как выбрать идеальное пальто: Советы стилиста",
    slug: "perfect-coat-tips",
    excerpt:
      "Пальто – это не просто одежда, это заявление. Наши эксперты поделятся секретами выбора идеального пальто, которое прослужит вам не один сезон.",
    publishedAt: new Date("2025-06-15"),
    viewCount: 980,
    likeCount: 67,
    commentCount: 15,
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-06-15"),
    author: {
      id: "2",
      name: "Иван Стильный",
      email: "ivan@example.com",
    },
    featuredImage: {
      id: "2",
      url: "/placeholder.svg?width=800&height=500",
      name: "perfect-coat-tips.jpg",
    },
    tags: [
      { id: "3", name: "Советы", slug: "tips", color: "#45b7d1" },
      { id: "4", name: "Пальто", slug: "coats", color: "#96ceb4" },
    ],
    categories: [
      {
        id: "2",
        name: "Советы стилиста",
        slug: "stylist-tips",
        description: "Советы от профессионалов",
      },
    ],
  },
  {
    id: "3",
    title: "История маленького черного платья",
    slug: "little-black-dress-history",
    excerpt:
      "Узнайте, как маленькое черное платье стало иконой стиля и почему оно должно быть в гардеробе каждой женщины.",
    publishedAt: new Date("2025-06-10"),
    viewCount: 2100,
    likeCount: 156,
    commentCount: 42,
    createdAt: new Date("2025-06-10"),
    updatedAt: new Date("2025-06-10"),
    author: {
      id: "3",
      name: "Мария Классик",
      email: "maria@example.com",
    },
    featuredImage: {
      id: "3",
      url: "/placeholder.svg?width=800&height=500",
      name: "little-black-dress-history.jpg",
    },
    tags: [
      {
        id: "5",
        name: "История моды",
        slug: "fashion-history",
        color: "#feca57",
      },
      { id: "6", name: "Классика", slug: "classic", color: "#ff9ff3" },
    ],
    categories: [
      {
        id: "3",
        name: "История моды",
        slug: "fashion-history",
        description: "Исторические факты о моде",
      },
    ],
  },
];
