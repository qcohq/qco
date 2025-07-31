import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  server: {
    AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().min(1).optional(),
    BETTER_AUTH_URL: z.string().url().optional(),
    AUTH_DOMAIN: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    RESEND_API_KEY: z.string().optional(),
    PORT: z.string().optional(),
  },
  client: {},
  experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.NODE_ENV === "test",
});
