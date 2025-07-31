import { createId } from "@paralleldrive/cuid2";
import slugify from "@sindresorhus/slugify";
import fs from "node:fs/promises";
import path from "node:path";
import { db } from "../client";
import { categories } from "../schemas/categories";

const categoriesJsonPath = path.resolve(__dirname, "./categories.json");
const imagesDir = path.resolve(__dirname, "./seed-images/categories");

async function ensureDirExists(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch { }
}

async function downloadImage(url: string, dest: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = await res.arrayBuffer();
    await fs.writeFile(dest, Buffer.from(buffer));
    return true;
  } catch {
    return false;
  }
}

function getImageExt(url: string) {
  const m = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.exec(url);
  return m ? m[1] : "jpg";
}

function flattenCategories(
  tree: any[],
  parentId: number | null = null,
  flat: any[] = [],
) {
  for (const cat of tree) {
    const { children, ...rest } = cat;
    flat.push({ ...rest, parent: parentId });
    if (children && Array.isArray(children)) {
      flattenCategories(children, cat.id, flat);
    }
  }
  return flat;
}

export async function seedCategories(now: Date) {
  await ensureDirExists(imagesDir);

  // Удаляем все категории перед сидированием
  await db.delete(categories);

  const raw = await fs.readFile(categoriesJsonPath, "utf-8");
  const tree = JSON.parse(raw);
  const flat = flattenCategories(tree);

  // Скачать изображения и заменить image на локальный путь
  for (const cat of flat) {
    if (
      cat.image &&
      typeof cat.image === "string" &&
      cat.image.startsWith("http")
    ) {
      const ext = getImageExt(cat.image);
      const localName = `${cat.id}.${ext}`;
      const localPath = path.join(imagesDir, localName);
      const ok = await downloadImage(cat.image, localPath);
      if (ok) {
        cat.image = `seed-images/categories/${localName}`;
      } else {
        cat.image = "";
      }
    }
    if (!cat.image) cat.image = "";
  }

  // Получаем существующие категории из БД
  const existing = await db.select().from(categories);
  const xmlIdToId: Record<string, string> = {};
  const slugToId: Record<string, string> = {};
  for (const cat of existing) {
    if (cat.xmlId != null) xmlIdToId[cat.xmlId] = cat.id;
    if (cat.slug != null) slugToId[cat.slug] = cat.id;
  }

  // Преобразуем flat в формат, подходящий для сидирования
  const usedSlugs = new Set<string>();
  const categoriesToInsert = flat.map((cat) => {
    const baseSlug = slugify(cat.title || cat.name || "");
    let slug = baseSlug;
    let i = 1;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${i++}`;
    }
    usedSlugs.add(slug);

    let parentCategorySlug: string | undefined;
    if (cat.parent) {
      const parent = flat.find((c2) => c2.id === cat.parent);
      parentCategorySlug = parent
        ? slugify(parent.title || parent.name || "")
        : undefined;
    }
    const xmlId = cat.id.toString();
    const id = xmlIdToId[xmlId] || createId();
    return {
      ...cat,
      id,
      slug,
      xmlId,
      parentCategorySlug,
      updatedAt: now,
      createdAt: now,
    };
  });

  // Обновляем маппинги после генерации новых id
  for (const category of categoriesToInsert) {
    xmlIdToId[category.xmlId] = category.id;
    slugToId[category.slug] = category.id;
  }

  // Вставляем/обновляем категории
  for (const category of categoriesToInsert) {
    const parentId = category.parentCategorySlug
      ? slugToId[category.parentCategorySlug]
      : undefined;

    try {
      await db
        .insert(categories)
        .values(
          parentId
            ? { ...category, parentId: parentId }
            : { ...category }
        )
        .onConflictDoUpdate({
          target: categories.xmlId, // обновляем по xmlId
          set: {
            ...category,
            parentId: parentId,
            updatedAt: now,
          },
        })
        .returning();
    } catch (e) {
      console.error(
        `❌ Не удалось вставить/обновить категорию '${category.name || category.title}':`,
        e,
      );
    }
  }

  console.log(`✅ Seeded/updated ${categoriesToInsert.length} categories`);
  return xmlIdToId;
}
