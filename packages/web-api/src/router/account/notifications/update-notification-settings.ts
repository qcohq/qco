import { protectedProcedure } from "../../../trpc";
import {
  UpdateNotificationSettingsSchema,
  NotificationSettingsSchema,
} from "@qco/web-validators";
import { TRPCError } from "@trpc/server";

export const updateNotificationSettings = protectedProcedure
  .input(UpdateNotificationSettingsSchema)
  .output(NotificationSettingsSchema)
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // TODO: Replace with actual database update logic when notification settings table is created
      // const existingSettings = await ctx.db.query.notificationSettings.findFirst({
      //   where: eq(notificationSettings.customerId, userId),
      // });

      // if (existingSettings) {
      //   await ctx.db.update(notificationSettings)
      //     .set({ ...input, updatedAt: new Date() })
      //     .where(eq(notificationSettings.customerId, userId));
      // } else {
      //   await ctx.db.insert(notificationSettings).values({
      //     customerId: userId,
      //     ...input,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   });
      // }

      // Mock response - merge with existing settings
      const mockCurrentSettings = {
        orderUpdates: true,
        promotions: true,
        newArrivals: true,
        accountActivity: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
      };

      const updatedSettings = {
        ...mockCurrentSettings,
        ...input,
      };

      return updatedSettings;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update notification settings",
      });
    }
  });
