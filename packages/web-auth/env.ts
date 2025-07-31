import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

/**
 * Environment variables that are only available on the server.
 */
const server = {
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  // Email configuration
  EMAIL_FROM: z.string().default("noreply@qco.me"),
  // Database URL for Drizzle
  POSTGRES_URL: z.string().url(),
  DATABASE_TYPE: z.enum(["neon", "postgres"]).default("neon"),
  // Vercel specific
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  // Port for development
  PORT: z.string().optional(),
} as const;

/**
 * Environment variables that are available on both client and server.
 */
const client = {
  // NEXT_PUBLIC_* variables go here
} as const;

/**
 * Create the environment variables schema.
 */
export const env = createEnv({
  extends: [vercel()],
  server,
  client,
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    // Add other runtime environment variables here
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

// Export the schema types
export type Env = typeof env;
export type ServerEnv = typeof server;
export type ClientEnv = typeof client;
