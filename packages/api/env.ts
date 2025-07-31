import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DATABASE_TYPE: z.string().optional(),
    POSTGRES_URL: z.string().url(),
    WEB_APP_URL: z.string().url().optional(),
    EMAIL_FROM: z.string().email().optional(),
    APP_URL: z.string().url(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    POSTGRES_URL: process.env.POSTGRES_URL,
    APP_URL: process.env.APP_URL,
    WEB_APP_URL: process.env.WEB_APP_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test",
});
