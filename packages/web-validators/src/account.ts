import { z } from "zod";

// Схема для статистики аккаунта
export const AccountStatsSchema = z.object({
  orders: z.object({
    total: z.number().min(0),
    yearSpent: z.number().min(0),
    totalSpent: z.number().min(0),
  }),
  favorites: z.number().min(0),
  bonusPoints: z.number().min(0),
});

// Схема для профиля пользователя (соответствует таблице customers)
export const AccountProfileSchema = z.object({
  id: z.string(),
  customerCode: z.string(),
  name: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  phone: z.string().nullable(),
  dateOfBirth: z.date().nullable(),
  gender: z.string().nullable(),
  image: z.string().nullable(),
  isGuest: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для обновления профиля
export const UpdateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Имя обязательно")
    .max(100, "Имя слишком длинное"),
  lastName: z
    .string()
    .min(1, "Фамилия обязательна")
    .max(100, "Фамилия слишком длинная"),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
});

// Схема для адреса пользователя (соответствует таблице customerAddresses)
export const AccountAddressSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  type: z.string(), // shipping, billing, both
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().nullable(),
  phone: z.string().nullable(),
  addressLine1: z.string(),
  addressLine2: z.string().nullable(),
  city: z.string(),
  state: z.string().nullable(),
  postalCode: z.string(),
  country: z.string(),
  isDefault: z.boolean(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для создания/обновления адреса
export const CreateAddressSchema = z.object({
  type: z.enum(["shipping", "billing", "both"]).default("shipping"),
  firstName: z.string().min(1, "Имя обязательно").max(100, "Имя слишком длинное"),
  lastName: z.string().min(1, "Фамилия обязательна").max(100, "Фамилия слишком длинная"),
  company: z.string().optional(),
  phone: z.string().optional(),
  addressLine1: z.string().min(1, "Адрес обязателен").max(255, "Адрес слишком длинный"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Город обязателен").max(100, "Город слишком длинный"),
  state: z.string().optional(),
  postalCode: z.string().min(1, "Почтовый индекс обязателен").max(20, "Почтовый индекс слишком длинный"),
  country: z.string().min(1, "Страна обязательна").max(100, "Страна слишком длинная"),
  isDefault: z.boolean().default(false),
  notes: z.string().optional(),
});

// Схема для списка адресов
export const AccountAddressesSchema = z.array(AccountAddressSchema);

// Схема для элемента заказа (соответствует таблице orderItems)
export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  variantId: z.string().nullable(),
  productName: z.string(),
  productSku: z.string().nullable(),
  variantName: z.string().nullable(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  attributes: z.record(z.string(), z.unknown()).nullable(), // JSON с атрибутами варианта
  image: z.string().nullable().optional(), // Главное изображение товара
  createdAt: z.date(),
});

// Схема для заказа (соответствует таблице orders)
export const AccountOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  subtotalAmount: z.number().min(0),
  shippingAmount: z.number().min(0),
  discountAmount: z.number().min(0),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash_on_delivery", "digital_wallet"]).nullable(),
  shippingMethod: z.enum(["standard", "express", "pickup", "same_day"]).nullable(),
  customerId: z.string(),
  shippingAddressId: z.string().nullable(),
  notes: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  trackingUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  confirmedAt: z.date().nullable(),
  shippedAt: z.date().nullable(),
  deliveredAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  items: z.array(OrderItemSchema),
});

// Схема для списка заказов
export const AccountOrdersSchema = z.array(AccountOrderSchema);

// Схема для фильтрации заказов
export const OrdersFilterSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]).optional(),
  sortBy: z
    .enum(["date-desc", "date-asc", "amount-desc", "amount-asc", "status"])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(50).optional(),
});

// Схема для деталей заказа
export const OrderDetailSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
  subtotalAmount: z.number().min(0),
  shippingAmount: z.number().min(0),
  discountAmount: z.number().min(0),
  taxAmount: z.number().min(0),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash_on_delivery", "digital_wallet"]).nullable(),
  shippingMethod: z.enum(["standard", "express", "pickup", "same_day"]).nullable(),
  customerId: z.string(),
  shippingAddressId: z.string().nullable(),
  notes: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  trackingUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  confirmedAt: z.date().nullable(),
  shippedAt: z.date().nullable(),
  deliveredAt: z.date().nullable(),
  cancelledAt: z.date().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  items: z.array(OrderItemSchema),
});

// Схема для изменения пароля
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Текущий пароль обязателен"),
    newPassword: z
      .string()
      .min(8, "Новый пароль должен содержать минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        error: "Пароли не совпадают",
      });
    }
  });

// Схема для удаления аккаунта
export const DeleteAccountSchema = z.object({
  password: z.string().min(1, "Пароль обязателен"),
  confirmDelete: z.literal(true, {
    error: "Необходимо подтвердить удаление аккаунта",
  }),
});

// Схема для платежного метода (пока используем mock данные, так как таблицы нет)
export const PaymentMethodSchema = z.object({
  id: z.string(),
  type: z.enum(["credit_card", "bank_transfer", "cash_on_delivery", "digital_wallet"]),
  name: z.string().min(1, "Название обязательно"),
  cardNumber: z.string().optional(), // Последние 4 цифры
  cardExpiry: z.string().optional(),
  cardType: z.string().optional(),
  lastFourDigits: z.string().optional(),
  expiryDate: z.string().optional(),
  isDefault: z.boolean().default(false),
  brand: z.string().optional(), // Visa, MasterCard, etc.
});

// Схема для создания/обновления платежного метода
export const CreatePaymentMethodSchema = z.object({
  type: z.enum(["credit_card", "bank_transfer", "cash_on_delivery", "digital_wallet"]),
  name: z.string().min(1, "Название обязательно"),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  isDefault: z.boolean().default(false),
  brand: z.string().optional(),
});

// Схема для списка платежных методов
export const PaymentMethodsSchema = z.array(PaymentMethodSchema);

// Схема для установки платежного метода по умолчанию
export const SetDefaultPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, "ID платежного метода обязателен"),
});

// Схема для удаления платежного метода
export const DeletePaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, "ID платежного метода обязателен"),
});

// Схема для настроек уведомлений (пока используем mock данные, так как таблицы нет)
export const NotificationSettingsSchema = z.object({
  orderUpdates: z.boolean().default(true),
  promotions: z.boolean().default(true),
  newArrivals: z.boolean().default(true),
  accountActivity: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
});

// Схема для обновления настроек уведомлений
export const UpdateNotificationSettingsSchema = z.object({
  orderUpdates: z.boolean().optional(),
  promotions: z.boolean().optional(),
  newArrivals: z.boolean().optional(),
  accountActivity: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

// Схема для избранного товара (соответствует таблице favorites)
export const FavoriteProductSchema = z.object({
  id: z.string(),
  productId: z.string(),
  customerId: z.string().nullable(),
  guestId: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для списка избранных товаров
export const FavoriteProductsSchema = z.array(FavoriteProductSchema);

// Схема для добавления товара в избранное
export const AddToFavoritesSchema = z.object({
  productId: z.string().min(1, "ID товара обязателен"),
});

// Схема для удаления товара из избранного
export const RemoveFromFavoritesSchema = z.object({
  productId: z.string().min(1, "ID товара обязателен"),
});

// Схема для проверки статуса избранного
export const CheckFavoriteStatusSchema = z.object({
  productId: z.string().min(1, "ID товара обязателен"),
});

// Типы для TypeScript
export type AccountStats = z.infer<typeof AccountStatsSchema>;
export type AccountProfile = z.infer<typeof AccountProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type AccountAddress = z.infer<typeof AccountAddressSchema>;
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type AccountAddresses = z.infer<typeof AccountAddressesSchema>;
export type AccountOrder = z.infer<typeof AccountOrderSchema>;
export type AccountOrders = z.infer<typeof AccountOrdersSchema>;
export type OrdersFilterInput = z.infer<typeof OrdersFilterSchema>;
export type AccountOrderDetail = z.infer<typeof OrderDetailSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;
export type AccountPaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type CreatePaymentMethodInput = z.infer<
  typeof CreatePaymentMethodSchema
>;
export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;
export type SetDefaultPaymentMethodInput = z.infer<
  typeof SetDefaultPaymentMethodSchema
>;
export type DeletePaymentMethodInput = z.infer<
  typeof DeletePaymentMethodSchema
>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type UpdateNotificationSettingsInput = z.infer<
  typeof UpdateNotificationSettingsSchema
>;
export type FavoriteProduct = z.infer<typeof FavoriteProductSchema>;
export type FavoriteProducts = z.infer<typeof FavoriteProductsSchema>;
export type AddToFavoritesInput = z.infer<typeof AddToFavoritesSchema>;
export type RemoveFromFavoritesInput = z.infer<
  typeof RemoveFromFavoritesSchema
>;
export type CheckFavoriteStatusInput = z.infer<
  typeof CheckFavoriteStatusSchema
>;
