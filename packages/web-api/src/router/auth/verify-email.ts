import { TRPCError } from "@trpc/server";
import { eq, and, gt } from "@qco/db";
import { customers, customerVerifications } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { verifyEmailSchema } from "@qco/web-validators";
import type { z } from "zod";

export const verifyEmail = publicProcedure
    .input(verifyEmailSchema)
    .mutation(
        async ({
            input,
            ctx,
        }: {
            input: z.infer<typeof verifyEmailSchema>;
            ctx: any;
        }) => {
            try {
                // Находим токен верификации
                const verification = await ctx.db.query.customerVerifications.findFirst({
                    where: eq(customerVerifications.value, input.token),
                });

                if (!verification) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Токен подтверждения не найден или недействителен",
                    });
                }

                // Проверяем, не истек ли токен
                if (verification.expiresAt < new Date()) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Срок действия токена подтверждения истек",
                    });
                }

                // Находим пользователя по email
                const customer = await ctx.db.query.customers.findFirst({
                    where: eq(customers.email, verification.identifier),
                });

                if (!customer) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Пользователь не найден",
                    });
                }

                // Проверяем, не подтвержден ли уже email
                if (customer.emailVerified) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Email уже подтвержден",
                    });
                }

                // Обновляем статус подтверждения email
                await ctx.db
                    .update(customers)
                    .set({
                        emailVerified: true,
                        updatedAt: new Date(),
                    })
                    .where(eq(customers.id, customer.id));

                // Удаляем использованный токен
                await ctx.db
                    .delete(customerVerifications)
                    .where(eq(customerVerifications.id, verification.id));

                return {
                    success: true,
                    message: "Email успешно подтвержден",
                    customer: {
                        id: customer.id,
                        email: customer.email,
                        emailVerified: true,
                    },
                };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Не удалось подтвердить email",
                });
            }
        }
    ); 