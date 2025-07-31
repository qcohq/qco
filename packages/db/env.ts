import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    DATABASE_TYPE: z.string().optional(),
    POSTGRES_URL: z.string().url(),
  },
  client: {},
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.NODE_ENV === "test",
});
