import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@qco/db/client";
import {
  accounts,
  sessions as SessionSchema,
  admins,
  verifications,
} from "@qco/db/schema";

import { env } from "../env";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      session: SessionSchema,
      account: accounts,
      user: admins,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    resetPassword: {
      enabled: true,
      redirectTo: "/reset-password",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
    cookie: {
      domain: env.AUTH_DOMAIN || undefined,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  socialProviders: env.AUTH_GOOGLE_CLIENT_ID && env.AUTH_GOOGLE_CLIENT_SECRET
    ? {
      google: {
        clientId: env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
        disableSignUp: true,
      },
    }
    : {},
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "user",
      adminRoles: ["super_admin", "admin", "moderator", "editor"],
      impersonationSessionDuration: 60 * 60, // 1 hour
      defaultBanReason: "Нарушение правил",
      bannedUserMessage: "Ваш аккаунт заблокирован. Обратитесь в поддержку, если считаете это ошибкой.",
    }),
  ],
  advanced: {
    generateId: false,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        enum: ["super_admin", "admin", "moderator", "editor"] as const,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

// Функция для проверки доступности Google провайдера
export const isGoogleProviderAvailable = () => {
  return !!(env.AUTH_GOOGLE_CLIENT_ID && env.AUTH_GOOGLE_CLIENT_SECRET);
};
