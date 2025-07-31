import { db } from "../../client-ws";

export async function getBrandNameToId(): Promise<Record<string, string>> {
  const brandsFromDb = await db.select().from(require("../../schemas/brands").Brand);
  const brandNameToId: Record<string, string> = {};
  for (const brand of brandsFromDb) {
      brandNameToId[brand.name.toLowerCase()] = brand.id;
  }
  return brandNameToId;
}
