import type { Config } from "drizzle-kit";
import { getDatabaseConfig } from "./src/config";

const config = getDatabaseConfig();

// Для NeonDB используем non-pooling URL, для PostgreSQL - обычный
const dbUrl =
  config.DATABASE_TYPE === "neon"
    ? config.POSTGRES_URL.replace(":6543", ":5432")
    : config.POSTGRES_URL;

export default {
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: dbUrl },
  casing: "snake_case",
} satisfies Config;
