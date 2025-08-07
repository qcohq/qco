import { type NextRequest, NextResponse } from "next/server";
import { eq, and, gt } from "drizzle-orm";
import { auth } from "@qco/web-auth";
import { db } from "@qco/db/client";
import { customers, customerVerifications } from "@qco/db/schema";
import { sendEmail, EmailVerification } from "@qco/emails";
import { createId } from "@paralleldrive/cuid2";

// Простое хранилище для rate limiting (в продакшене лучше использовать Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Rate limiting: максимум 3 запроса в час для одного email
        const now = Date.now();
        const hour = 60 * 60 * 1000;
        const rateLimitKey = `email_verification:${email}`;
        const rateLimit = rateLimitStore.get(rateLimitKey);

        if (rateLimit && now < rateLimit.resetTime) {
            if (rateLimit.count >= 10) {
                return NextResponse.json(
                    { error: "Too many requests. Please wait before requesting another verification email." },
                    { status: 429 }
                );
            }
            rateLimit.count++;
        } else {
            rateLimitStore.set(rateLimitKey, {
                count: 1,
                resetTime: now + hour,
            });
        }

        // Проверяем, существует ли пользователь
        const user = await db.query.customers.findFirst({
            where: eq(customers.email, email),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Проверяем, не подтвержден ли уже email
        if (user.emailVerified) {
            return NextResponse.json(
                { error: "Email already verified" },
                { status: 400 }
            );
        }

        // Проверяем, есть ли уже активный токен верификации
        const existingVerification = await db.query.customerVerifications.findFirst({
            where: and(
                eq(customerVerifications.identifier, email),
                gt(customerVerifications.expiresAt, new Date())
            ),
        });

        let token: string;
        let expiresAt: Date;

        if (existingVerification) {
            // Используем существующий токен
            token = existingVerification.value;
            expiresAt = existingVerification.expiresAt;
        } else {
            // Генерируем новый токен верификации
            token = createId();
            expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // Токен действителен 24 часа

            // Сохраняем токен в базе данных
            await db.insert(customerVerifications).values({
                identifier: email,
                value: token,
                expiresAt,
            });
        }

        // Формируем URL для подтверждения
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";
        const verificationUrl = `${baseUrl}/auth/email-verified?token=${token}`;

        // Отправляем email
        await sendEmail({
            to: [email],
            subject: "Подтверждение email адреса",
            react: EmailVerification({
                otp: token,
                email: email,
                url: verificationUrl,
            }),
        });

        return NextResponse.json(
            { success: true, message: "Verification email sent" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending verification email:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 