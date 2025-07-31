import { createId } from "@paralleldrive/cuid2";
import { db } from "../client";
import { banners, bannerFiles, files } from "../schemas";

export async function seedBanners(now: Date) {
  console.log("Seeding banners...");

  // Создаем тестовые файлы для баннеров
  const filesData = [
    {
      id: createId(),
      name: "hero-banner-1.jpg",
      mimeType: "image/jpeg",
      size: 1024000,
      path: "/placeholder.svg?height=800&width=1200&text=Новая+коллекция+CHANEL",
      type: "banner" as const,
      uploadedBy: "seed-admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "hero-banner-2.jpg",
      mimeType: "image/jpeg",
      size: 1024000,
      path: "/placeholder.svg?height=800&width=1200&text=Эксклюзивные+сумки+HERMÈS",
      type: "banner" as const,
      uploadedBy: "seed-admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "hero-banner-3.jpg",
      mimeType: "image/jpeg",
      size: 1024000,
      path: "/placeholder.svg?height=800&width=1200&text=Мужская+коллекция+GUCCI",
      type: "banner" as const,
      uploadedBy: "seed-admin",
      createdAt: now,
      updatedAt: now,
    },
    // Добавляем файлы для баннеров категории "muzhchinam"
    {
      id: createId(),
      name: "men-category-banner-1.jpg",
      mimeType: "image/jpeg",
      size: 1024000,
      path: "/placeholder.svg?height=800&width=1200&text=Мужская+мода+2024",
      type: "banner" as const,
      uploadedBy: "seed-admin",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "men-category-banner-2.jpg",
      mimeType: "image/jpeg",
      size: 1024000,
      path: "/placeholder.svg?height=800&width=1200&text=Классический+стиль",
      type: "banner" as const,
      uploadedBy: "seed-admin",
      createdAt: now,
      updatedAt: now,
    },
  ];

  // Вставляем файлы
  for (const file of filesData) {
    await db.insert(files).values(file).onConflictDoNothing();
  }

  // Создаем тестовые баннеры
  const bannersData = [
    {
      id: createId(),
      name: "Новая коллекция CHANEL",
      title: "Новая коллекция CHANEL",
      description: "Откройте для себя изысканные творения от легендарного французского дома моды",
      link: "/women/new",
      linkText: "Смотреть коллекцию",
      isActive: true,
      isFeatured: true,
      position: "hero",
      section: "home",
      priority: 100,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      views: 0,
      clicks: 0,
      ctr: "0",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed-admin",
      updatedBy: "seed-admin",
    },
    {
      id: createId(),
      name: "Эксклюзивные сумки HERMÈS",
      title: "Эксклюзивные сумки HERMÈS",
      description: "Легендарные модели Birkin и Kelly от мастеров французского дома",
      link: "/women/bags",
      linkText: "Посмотреть сумки",
      isActive: true,
      isFeatured: true,
      position: "hero",
      section: "home",
      priority: 90,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      views: 0,
      clicks: 0,
      ctr: "0",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed-admin",
      updatedBy: "seed-admin",
    },
    {
      id: createId(),
      name: "Мужская коллекция GUCCI",
      title: "Мужская коллекция GUCCI",
      description: "Современная элегантность и традиционное мастерство в каждой детали",
      link: "/men",
      linkText: "Мужская коллекция",
      isActive: true,
      isFeatured: true,
      position: "hero",
      section: "home",
      priority: 80,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      views: 0,
      clicks: 0,
      ctr: "0",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed-admin",
      updatedBy: "seed-admin",
    },
    // Добавляем баннеры для категории "muzhchinam"
    {
      id: createId(),
      name: "Мужская мода 2024",
      title: "Мужская мода 2024",
      description: "Откройте для себя последние тренды мужской моды от ведущих дизайнеров",
      link: "/men/new",
      linkText: "Новинки",
      isActive: true,
      isFeatured: true,
      position: "hero",
      section: "category",
      categorySlug: "muzhchinam",
      priority: 95,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      views: 0,
      clicks: 0,
      ctr: "0",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed-admin",
      updatedBy: "seed-admin",
    },
    {
      id: createId(),
      name: "Классический стиль",
      title: "Классический стиль",
      description: "Вневременная элегантность для современного мужчины",
      link: "/men/classic",
      linkText: "Классика",
      isActive: true,
      isFeatured: false,
      position: "hero",
      section: "category",
      categorySlug: "muzhchinam",
      priority: 85,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      views: 0,
      clicks: 0,
      ctr: "0",
      createdAt: now,
      updatedAt: now,
      createdBy: "seed-admin",
      updatedBy: "seed-admin",
    },
  ];

  // Вставляем баннеры
  for (const banner of bannersData) {
    await db.insert(banners).values(banner).onConflictDoNothing();
  }

  // Создаем связи баннеров с файлами
  const bannerFileRelations = [
    {
      id: createId(),
      bannerId: bannersData[0]!.id,
      fileId: filesData[0]!.id,
      type: "desktop" as const,
      variant: "primary" as const,
      order: 0,
      altText: "Новая коллекция CHANEL",
      createdAt: now,
    },
    {
      id: createId(),
      bannerId: bannersData[1]!.id,
      fileId: filesData[1]!.id,
      type: "desktop" as const,
      variant: "primary" as const,
      order: 0,
      altText: "Эксклюзивные сумки HERMÈS",
      createdAt: now,
    },
    {
      id: createId(),
      bannerId: bannersData[2]!.id,
      fileId: filesData[2]!.id,
      type: "desktop" as const,
      variant: "primary" as const,
      order: 0,
      altText: "Мужская коллекция GUCCI",
      createdAt: now,
    },
    // Добавляем связи для баннеров категории "muzhchinam"
    {
      id: createId(),
      bannerId: bannersData[3]!.id,
      fileId: filesData[3]!.id,
      type: "desktop" as const,
      variant: "primary" as const,
      order: 0,
      altText: "Мужская мода 2024",
      createdAt: now,
    },
    {
      id: createId(),
      bannerId: bannersData[4]!.id,
      fileId: filesData[4]!.id,
      type: "desktop" as const,
      variant: "primary" as const,
      order: 0,
      altText: "Классический стиль",
      createdAt: now,
    },
  ];

  // Вставляем связи баннеров с файлами
  for (const bannerFile of bannerFileRelations) {
    await db.insert(bannerFiles).values(bannerFile).onConflictDoNothing();
  }

  console.log(`Seeded ${bannersData.length} banners with files`);
} 
