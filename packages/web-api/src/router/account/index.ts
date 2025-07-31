import { profileRouter } from "./profile";
import { addressesRouter } from "./addresses";
import { ordersRouter } from "./orders";
import { statsRouter } from "./stats";
import { favoritesRouter } from "./favorites";
import { paymentMethodsRouter } from "./payment-methods";
import { notificationsRouter } from "./notifications";

export const accountRouter = {
  // Profile management
  ...profileRouter,

  // Address management
  ...addressesRouter,

  // Orders management
  ...ordersRouter,

  // Account statistics
  ...statsRouter,

  // Favorites management
  ...favoritesRouter,

  // Payment methods management
  ...paymentMethodsRouter,

  // Notification settings
  ...notificationsRouter,
};
