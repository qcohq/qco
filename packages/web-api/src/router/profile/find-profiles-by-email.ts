import { TRPCError } from "@trpc/server";
import { eq, like } from "@qco/db";
import { customers, customerAddresses } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { z } from "zod";

// Схема для поиска профилей по email
const findProfilesByEmailSchema = z.object({
    email: z.string().email(),
});

export const findProfilesByEmail = publicProcedure
    .input(findProfilesByEmailSchema)
    .query(async ({ ctx, input }) => {
        try {
            // Ищем клиентов с похожим email
            const customersData = await ctx.db.query.customers.findMany({
                where: like(customers.email, `%${input.email}%`),
                with: {
                    addresses: {
                        where: eq(customerAddresses.isDefault, true),
                        limit: 1,
                    },
                },
            });

            // Форматируем данные для фронтенда
            const profiles = customersData.map((customer) => {
                const primaryAddress = customer.addresses[0];

                return {
                    id: customer.id,
                    firstName: customer.firstName || "",
                    lastName: customer.lastName || "",
                    email: customer.email,
                    phone: customer.phone || "",
                    address: primaryAddress?.addressLine1 || "",
                    apartment: primaryAddress?.addressLine2 || "",
                    city: primaryAddress?.city || "",
                    state: primaryAddress?.state || "",
                    postalCode: primaryAddress?.postalCode || "",
                    isGuest: customer.isGuest,
                };
            });

            return profiles;
        } catch (error) {
            console.error("Error finding profiles by email:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось найти профили",
            });
        }
    }); 