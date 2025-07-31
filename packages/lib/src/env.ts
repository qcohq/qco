import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    STORAGE_ENDPOINT_URL: z.string().url(),
    STORAGE_ACCESS_KEY_ID: z.string(),
    STORAGE_SECRET_ACCESS_KEY: z.string(),
    STORAGE_BUCKET_NAME: z.string(),
    STORAGE_REGION: z.string(),
    STORAGE_CDN_URL: z.string().url().optional(),
  },
  client: {},
  clientPrefix: "NEXT_PUBLIC_",
  runtimeEnv: {
    STORAGE_ENDPOINT_URL: process.env.STORAGE_ENDPOINT_URL,
    STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
    STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
    STORAGE_BUCKET_NAME: process.env.STORAGE_BUCKET_NAME,
    STORAGE_REGION: process.env.STORAGE_REGION,
    STORAGE_CDN_URL: process.env.STORAGE_CDN_URL,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
