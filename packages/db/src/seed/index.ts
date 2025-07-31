import { createId } from "@paralleldrive/cuid2";
import { db } from "../client";
import { admins } from "../schemas/admin";
import { seedBrands } from "./seed-brands";
import { seedCategories } from "./seed-categories";
import { seedProducts } from "./products/seedProducts";
import { seedBanners } from "./seed-banners";
import { seedBlog } from "./seed-blog";
import { env } from "../../env";

if (!env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

// Получить первого админа для createdBy/updatedBy (или создать тестового)
async function getDefaultAdminId() {
  const adminList = await db.select().from(admins).limit(1);
  if (adminList.length > 0 && adminList[0]?.id) return adminList[0].id;
  const id = createId();
  await db.insert(admins).values({
    id,
    name: "Seed Admin",
    email: "seedadmin@example.com",
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return id;
}

async function main() {
  const arg = process.argv[2]?.toLowerCase();
  const adminId = await getDefaultAdminId();
  const now = new Date();

  switch (arg) {
    case "categories":
      await seedCategories(now);
      break;
    case "brands":
      await seedBrands(now, adminId);
      break;
    case "products":
      await seedProducts();
      break;
    case "banners":
      await seedBanners(now);
      break;
    case "blog":
      await seedBlog(now, adminId);
      break;

    case "all":
    case undefined:
      await seedCategories(now);
      await seedBrands(now, adminId);
      await seedProducts();
      await seedBanners(now);
      await seedBlog(now, adminId);
      break;
    default:
      console.error(`Неизвестная сущность для сидирования: ${arg}`);
      process.exit(1);
  }

  console.log("Seeding completed");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
