import { deliverySettings } from "@qco/db/schema";
import { deliverySettingsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const create = protectedProcedure
    .input(deliverySettingsSchema)
    .mutation(async ({ ctx, input }) => {
        const [setting] = await ctx.db
            .insert(deliverySettings)
            .values({
                name: input.name,
                description: input.description,
                isActive: input.isActive,
                deliveryType: input.deliveryType,
                minOrderAmount: input.minOrderAmount.toString(),
                maxOrderAmount: input.maxOrderAmount?.toString(),
                deliveryCost: input.deliveryCost.toString(),
                freeDeliveryThreshold: input.freeDeliveryThreshold?.toString(),
                estimatedDays: input.estimatedDays,
                regions: input.regions,
                weightLimit: input.weightLimit?.toString(),
                sizeLimit: input.sizeLimit,
                isDefault: input.isDefault,
            })
            .returning();

        return setting;
    }); 
