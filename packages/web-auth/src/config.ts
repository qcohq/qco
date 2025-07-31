import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { sql } from "@qco/db";

import { db } from "@qco/db/client";
import {
  customers,
  customerAccounts,
  customerSessions,
  customerVerifications,
} from "@qco/db/schema";
import { sendEmail, PasswordResetEmail, EmailVerification } from "@qco/emails";

import { env } from "../env";
import { createAuthMiddleware } from "better-auth/api";

// Функция для генерации уникального кода клиента
async function generateCustomerCode(): Promise<string> {
  const result = await db
    .select({
      maxNumber: sql<string>`COALESCE(
        MAX(CAST(SUBSTRING(customer_code FROM 6) AS INTEGER)), 
        0
      )`
    })
    .from(customers);

  const maxNumber = Number.parseInt(result[0]?.maxNumber || "0", 10);
  const nextNumber = maxNumber + 1;
  return `CUST-${nextNumber.toString().padStart(5, '0')}`;
}

// Обычный drizzleAdapter без кастомизации
const drizzle = drizzleAdapter(db, {
  provider: "pg",
  schema: {
    session: customerSessions,
    account: customerAccounts,
    user: customers,
    verification: customerVerifications,
  },
});

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      await sendEmail({
        to: [user.email],
        subject: "Подтверждение email адреса",
        react: EmailVerification({
          otp: token,
          email: user.email,
          url,
        }),
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60 * 24,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: [user.email],
        subject: "Сброс пароля",
        react: PasswordResetEmail({
          resetLink: url,
          username: user.name ?? user.email,
        }),
      });
    },
  },
  database: drizzle,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookie: {
      secure: env.NODE_ENV === "production",
      sameSite: "lax" as const,
      httpOnly: true,
      path: "/",
    },
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",

    newUser: "/onboarding",
  },
  plugins: [
    nextCookies(),
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      customerCode: {
        type: "string" as const,
        required: true,
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              customerCode: await generateCustomerCode(),
            },
          },
        };
      }
    }),
  } as any,
  debug: env.NODE_ENV === "development",
});

// Экспортируем типы
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
