import { z } from "zod";
import { env } from "../env";

export const dbConfigSchema = z.object({
  DATABASE_TYPE: z.enum(["neon", "postgres"]).default("neon"),
  POSTGRES_URL: z.string().url(),
});

export type DatabaseConfig = z.infer<typeof dbConfigSchema>;

export function getDatabaseConfig(): DatabaseConfig {
  if (!env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is required");
  }

  return dbConfigSchema.parse({
    DATABASE_TYPE: env.DATABASE_TYPE || "neon",
    POSTGRES_URL: env.POSTGRES_URL,
  });
}
