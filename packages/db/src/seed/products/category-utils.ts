import { db } from "../../client-ws";
import { categories } from "../../schemas/categories";

export async function getCategoryXmlIdToId(): Promise<Record<string, string>> {
  const cats = await db.select().from(categories).limit(-1);
  return Object.fromEntries(
    cats.filter((c: any) => c.xmlId).map((c: any) => [c.xmlId, c.id]),
  );
}
