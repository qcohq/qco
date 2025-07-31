import { protectedProcedure } from "../../../trpc";
import { NotificationSettingsSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";

export const getNotificationSettings = protectedProcedure
  .output(NotificationSettingsSchema)
  .query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      // TODO: Replace with actual database query when notification settings table is created
      // const settings = await ctx.db.query.notificationSettings.findFirst({
      //   where: eq(notificationSettings.customerId, userId),
      // });

      // Mock data for now - возвращаем дефолтные значения
      const mockSettings = {
        orderUpdates: true,
        promotions: true,
        newArrivals: true,
        accountActivity: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
      };

      return mockSettings;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notification settings",
      });
    }
  });
