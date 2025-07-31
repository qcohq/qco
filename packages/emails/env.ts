import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]).optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_SANDBOX_ENABLED: z.string().optional(),
    EMAIL_SANDBOX_HOST: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    SITE_NAME: z.string().default("QCO"),
    SITE_URL: z.string().url().optional(),
  },
  client: {},
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_SANDBOX_ENABLED: process.env.EMAIL_SANDBOX_ENABLED,
    EMAIL_SANDBOX_HOST: process.env.EMAIL_SANDBOX_HOST,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SITE_NAME: process.env.SITE_NAME,
    SITE_URL: process.env.SITE_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
