import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { customers, customerAddresses } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

// Схема для создания профиля из данных заказа
const createProfileFromOrderSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    saveAddress: z.boolean().optional(),
});

export const createProfileFromOrder = publicProcedure
    .input(createProfileFromOrderSchema)
    .mutation(async ({ ctx, input }) => {
        try {
            // Проверяем, существует ли уже пользователь с таким email
            const existingCustomer = await ctx.db.query.customers.findFirst({
                where: eq(customers.email, input.email),
            });

            if (existingCustomer) {
                // Если пользователь существует, обновляем его данные
                const [updatedCustomer] = await ctx.db
                    .update(customers)
                    .set({
                        firstName: input.firstName,
                        lastName: input.lastName,
                        phone: input.phone,
                        isGuest: false, // Превращаем гостя в зарегистрированного пользователя
                        updatedAt: new Date(),
                    })
                    .where(eq(customers.id, existingCustomer.id))
                    .returning();

                // Если нужно сохранить адрес, создаем его
                if (input.saveAddress) {
                    await ctx.db.insert(customerAddresses).values({
                        id: createId(),
                        customerId: existingCustomer.id,
                        type: "shipping",
                        firstName: input.firstName,
                        lastName: input.lastName,
                        addressLine1: input.address,
                        addressLine2: input.apartment,
                        city: input.city,
                        state: input.state,
                        postalCode: input.postalCode,
                        country: "Россия", // По умолчанию
                        isDefault: true, // Делаем основным адресом
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }

                return {
                    success: true,
                    customerId: existingCustomer.id,
                    message: "Профиль обновлен",
                };
            }

            // Если пользователя нет, создаем нового
            const customerCode = `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const [newCustomer] = await ctx.db.insert(customers).values({
                id: createId(),
                customerCode,
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                isGuest: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning();

            // Если нужно сохранить адрес, создаем его
            if (input.saveAddress) {
                await ctx.db.insert(customerAddresses).values({
                    id: createId(),
                    customerId: newCustomer.id,
                    type: "shipping",
                    firstName: input.firstName,
                    lastName: input.lastName,
                    addressLine1: input.address,
                    addressLine2: input.apartment,
                    city: input.city,
                    state: input.state,
                    postalCode: input.postalCode,
                    country: "Россия", // По умолчанию
                    isDefault: true, // Делаем основным адресом
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            return {
                success: true,
                customerId: newCustomer.id,
                message: "Профиль создан",
            };
        } catch (error) {
            console.error("Error creating profile from order:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось создать профиль",
            });
        }
    }); 