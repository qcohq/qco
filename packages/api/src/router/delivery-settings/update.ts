import { eq } from "@qco/db";
import { deliverySettings } from "@qco/db/schema";
import { deliverySettingsSchema } from "@qco/validators";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";

export const update = protectedProcedure
    .input(
        z.object({
            id: z.string(),
            data: deliverySettingsSchema.partial(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const [setting] = await ctx.db
            .update(deliverySettings)
            .set({
                name: input.data.name,
                description: input.data.description,
                isActive: input.data.isActive,
                deliveryType: input.data.deliveryType,
                minOrderAmount: input.data.minOrderAmount?.toString(),
                maxOrderAmount: input.data.maxOrderAmount?.toString(),
                deliveryCost: input.data.deliveryCost?.toString(),
                freeDeliveryThreshold: input.data.freeDeliveryThreshold?.toString(),
                estimatedDays: input.data.estimatedDays,
                regions: input.data.regions,
                weightLimit: input.data.weightLimit?.toString(),
                sizeLimit: input.data.sizeLimit,
                isDefault: input.data.isDefault,
                updatedAt: new Date(),
            })
            .where(eq(deliverySettings.id, input.id))
            .returning();

        return setting;
    }); 
