import { protectedProcedure } from "../../../trpc";
import { CreateAddressSchema, AccountAddressSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { customerAddresses } from "@qco/db/schema";
import { and, eq, ne } from "@qco/db";
import { z } from "zod";

export const updateAddress = protectedProcedure
    .input(
        z.object({
            addressId: z.string().min(1, "ID адреса обязателен"),
            ...CreateAddressSchema.shape,
        })
    )
    .output(AccountAddressSchema)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user?.id;

        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        const { addressId, ...addressData } = input;

        try {
            // Проверяем, существует ли адрес и принадлежит ли он пользователю
            const existingAddress = await ctx.db.query.customerAddresses.findFirst({
                where: and(
                    eq(customerAddresses.id, addressId),
                    eq(customerAddresses.customerId, userId)
                ),
            });

            if (!existingAddress) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Address not found or you do not have permission to update it",
                });
            }

            // Если адрес помечен как дефолтный, сбрасываем дефолтный статус у других адресов
            if (addressData.isDefault) {
                await ctx.db
                    .update(customerAddresses)
                    .set({ isDefault: false })
                    .where(
                        and(
                            eq(customerAddresses.customerId, userId),
                            eq(customerAddresses.type, addressData.type),
                            ne(customerAddresses.id, addressId)
                        )
                    );
            }

            const [updatedAddress] = await ctx.db
                .update(customerAddresses)
                .set({
                    type: addressData.type,
                    firstName: addressData.firstName,
                    lastName: addressData.lastName,
                    company: addressData.company || null,
                    phone: addressData.phone || null,
                    addressLine1: addressData.addressLine1,
                    addressLine2: addressData.addressLine2 || null,
                    city: addressData.city,
                    state: addressData.state || null,
                    postalCode: addressData.postalCode,
                    country: addressData.country,
                    isDefault: addressData.isDefault,
                    notes: addressData.notes || null,
                    updatedAt: new Date(),
                })
                .where(eq(customerAddresses.id, addressId))
                .returning();

            if (!updatedAddress) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update address",
                });
            }

            return {
                id: updatedAddress.id,
                customerId: updatedAddress.customerId,
                type: updatedAddress.type,
                firstName: updatedAddress.firstName,
                lastName: updatedAddress.lastName,
                company: updatedAddress.company,
                phone: updatedAddress.phone,
                addressLine1: updatedAddress.addressLine1,
                addressLine2: updatedAddress.addressLine2,
                city: updatedAddress.city,
                state: updatedAddress.state,
                postalCode: updatedAddress.postalCode,
                country: updatedAddress.country,
                isDefault: updatedAddress.isDefault,
                notes: updatedAddress.notes,
                createdAt: updatedAddress.createdAt,
                updatedAt: updatedAddress.updatedAt,
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update address",
            });
        }
    }); 