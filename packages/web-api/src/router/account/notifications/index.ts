import type { TRPCRouterRecord } from "@trpc/server";
import { getNotificationSettings } from "./get-notification-settings";
import { updateNotificationSettings } from "./update-notification-settings";

export const notificationsRouter = {
  getNotificationSettings,
  updateNotificationSettings,
} satisfies TRPCRouterRecord;
