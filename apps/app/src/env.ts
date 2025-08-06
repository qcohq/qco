import { env as authEnv } from "@qco/auth/env";
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [authEnv, vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_WEB_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    POSTGRES_URL: z.string().url(),
    DATABASE_TYPE: z.enum(["neon", "postgres"]).default("neon"),
    WEB_APP_URL: z.string().url().optional(),
    EMAIL_FROM: z.string().email().optional(),
    APP_URL: z.string().url(),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_WEB_APP_URL: process.env.NEXT_PUBLIC_WEB_APP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.NODE_ENV === "development",
});
