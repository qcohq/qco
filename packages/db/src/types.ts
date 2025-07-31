import type { InferSelectModel } from "drizzle-orm";
import type { drizzle as drizzleNeonServerless } from "drizzle-orm/neon-serverless";
import type { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import type * as schema from "./schemas";
import type { products } from "./schemas";
type Product = typeof products.$inferSelect;

export type Database =
  | ReturnType<typeof drizzleNeonServerless<typeof schema>>
  | ReturnType<typeof drizzlePg<typeof schema>>;

export interface ProductWithExtendedAttributes {
  product: Product;
  extendedAttributes: {
    id: string;
    name: string;
    type: string;
    value: string;
  }[];
}
