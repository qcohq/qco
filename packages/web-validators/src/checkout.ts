import { z } from "zod";

// Схема для контактной информации и адреса доставки
export const checkoutCustomerInfoSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email обязателен" })
    .email({ error: "Введите корректный email" }),
  firstName: z
    .string()
    .min(2, { error: "Имя должно содержать минимум 2 символа" })
    .max(50, { error: "Имя не должно превышать 50 символов" }),
  lastName: z
    .string()
    .min(2, { error: "Фамилия должна содержать минимум 2 символа" })
    .max(50, { error: "Фамилия не должна превышать 50 символов" }),
  phone: z
    .string()
    .min(10, { error: "Телефон должен содержать минимум 10 цифр" })
    .regex(/^[+]?[0-9\s()-]+$/, {
      error: "Введите корректный номер телефона",
    }),
  address: z
    .string()
    .min(5, { error: "Адрес должен содержать минимум 5 символов" })
    .max(100, { error: "Адрес не должен превышать 100 символов" }),
  apartment: z.string().optional(),
  city: z
    .string()
    .min(2, { error: "Город должен содержать минимум 2 символа" })
    .max(50, { error: "Город не должен превышать 50 символов" }),
  state: z
    .string()
    .min(2, { error: "Регион должен содержать минимум 2 символа" })
    .max(50, { error: "Регион не должен превышать 50 символов" }),
  postalCode: z
    .string()
    .min(5, { error: "Почтовый индекс должен содержать минимум 5 символов" })
    .max(10, { error: "Почтовый индекс не должен превышать 10 символов" }),
  saveInfo: z.boolean().optional(),
});

// Схема для выбора способа доставки
export const checkoutShippingMethodSchema = z.object({
  shippingMethod: z.string().min(1, { error: "Выберите способ доставки" }),
  deliveryInstructions: z.string().optional(),
  // Поля для даты и времени доставки (только для курьерской доставки)
  deliveryDate: z.date().optional(),
  deliveryTimeSlot: z.string().optional(),
});

// Схема для платежной информации
export const checkoutPaymentSchema = z.object({
  paymentMethod: z.enum(["cash-on-delivery", "card-on-delivery"])
    .describe("Выберите способ оплаты"),
  // Дополнительные поля для кредитной карты
  cardDetails: z
    .object({
      cardNumber: z
        .string()
        .min(16, { error: "Номер карты должен содержать минимум 16 цифр" })
        .regex(/^[0-9\s]+$/, {
          error: "Номер карты должен содержать только цифры",
        }),
      cardName: z
        .string()
        .min(3, { error: "Имя владельца должно содержать минимум 3 символа" })
        .max(50, { error: "Имя владельца не должно превышать 50 символов" }),
      expiryDate: z
        .string()
        .min(5, { error: "Введите срок действия в формате MM/YY" })
        .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
          error: "Введите срок действия в формате MM/YY",
        }),
      cvv: z
        .string()
        .min(3, { error: "CVV должен содержать минимум 3 цифры" })
        .max(4, { error: "CVV не должен превышать 4 цифры" })
        .regex(/^[0-9]+$/, { error: "CVV должен содержать только цифры" }),
      saveCard: z.boolean().optional(),
    })
    .optional()
    .refine(
      (data) => {
        // Если метод оплаты - кредитная карта, то данные карты обязательны
        return true;
      },
      { error: "Заполните данные карты" },
    ),
});

// Схема для опций профиля
export const checkoutProfileOptionsSchema = z.object({
  saveToProfile: z.boolean().optional(),
  createProfile: z.boolean().optional(),
});

// Полная схема для формы оформления заказа (для фронтенда)
export const checkoutFormSchema = z.object({
  // Контактная информация
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),

  // Адрес доставки
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов"),
  apartment: z.string().optional(),
  city: z.string().min(2, "Город должен содержать минимум 2 символа"),
  state: z.string().min(2, "Регион должен содержать минимум 2 символа"),
  postalCode: z
    .string()
    .min(5, "Почтовый индекс должен содержать минимум 5 символов"),

  // Способ доставки
  shippingMethod: z.string().min(1, "Выберите способ доставки"),
  deliveryDate: z.date().optional(),
  deliveryTimeSlot: z.string().optional(),
  deliveryInstructions: z.string().optional(),

  // Способ оплаты
  paymentMethod: z.enum(["cash-on-delivery", "card-on-delivery"]),

  // Опции профиля
  saveToProfile: z.boolean().optional(),
  createProfile: z.boolean().optional(),
});

// Схема для частичных данных черновика (все поля опциональные)
export const checkoutDraftSchema = z.object({
  // Контактная информация
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа").optional(),
  email: z.string().email("Введите корректный email").optional(),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр").optional(),

  // Адрес доставки
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов").optional(),
  apartment: z.string().optional(),
  city: z.string().min(2, "Город должен содержать минимум 2 символа").optional(),
  state: z.string().min(2, "Регион должен содержать минимум 2 символа").optional(),
  postalCode: z
    .string()
    .min(5, "Почтовый индекс должен содержать минимум 5 символов")
    .optional(),

  // Способ доставки
  shippingMethod: z.string().min(1, "Выберите способ доставки").optional(),
  deliveryDate: z.date().optional(),
  deliveryTimeSlot: z.string().optional(),
  deliveryInstructions: z.string().optional(),

  // Способ оплаты
  paymentMethod: z.enum(["cash-on-delivery", "card-on-delivery"]).optional(),

  // Опции профиля
  saveToProfile: z.boolean().optional(),
  createProfile: z.boolean().optional(),
});

// Схема для валидации частичных данных с улучшенной обработкой ошибок
export const checkoutDraftPartialSchema = checkoutDraftSchema.partial().refine(
  (data) => {
    // Проверяем, что переданы хотя бы какие-то данные
    return Object.keys(data).length > 0;
  },
  {
    message: "Должны быть переданы хотя бы какие-то данные для сохранения",
  }
);

// Схема для валидации контактной информации (частичная)
export const checkoutContactInfoDraftSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа").optional(),
  email: z.string().email("Введите корректный email").optional(),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр").optional(),
}).partial();

// Схема для валидации адреса доставки (частичная)
export const checkoutShippingAddressDraftSchema = z.object({
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов").optional(),
  apartment: z.string().optional(),
  city: z.string().min(2, "Город должен содержать минимум 2 символа").optional(),
  state: z.string().min(2, "Регион должен содержать минимум 2 символа").optional(),
  postalCode: z
    .string()
    .min(5, "Почтовый индекс должен содержать минимум 5 символов")
    .optional(),
}).partial();

// Схема для валидации способа доставки (частичная)
export const checkoutShippingMethodDraftSchema = z.object({
  shippingMethod: z.string().min(1, "Выберите способ доставки").optional(),
  deliveryDate: z.date().optional(),
  deliveryTimeSlot: z.string().optional(),
  deliveryInstructions: z.string().optional(),
}).partial();

// Схема для валидации способа оплаты (частичная)
export const checkoutPaymentMethodDraftSchema = z.object({
  paymentMethod: z.enum(["cash-on-delivery", "card-on-delivery"]).optional(),
}).partial();

// Утилита для валидации частичных данных с детальными ошибками
export function validateDraftData(data: any): DraftValidationResult {
  const result = checkoutDraftPartialSchema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      data: result.data,
      errors: null
    };
  } else {
    return {
      isValid: false,
      data: null,
      errors: result.error.issues
    };
  }
}

// Полная схема для всего процесса оформления заказа (для API)
export const checkoutSchema = z.object({
  customerInfo: checkoutCustomerInfoSchema,
  shippingMethod: checkoutShippingMethodSchema,
  payment: checkoutPaymentSchema,
  profileOptions: checkoutProfileOptionsSchema.optional(),
});

// Типы на основе схем
export type CheckoutCustomerInfoFormValues = z.infer<
  typeof checkoutCustomerInfoSchema
>;
export type CheckoutShippingMethodFormValues = z.infer<
  typeof checkoutShippingMethodSchema
>;
export type CheckoutPaymentFormValues = z.infer<typeof checkoutPaymentSchema>;
export type CheckoutProfileOptionsFormValues = z.infer<
  typeof checkoutProfileOptionsSchema
>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
export type CheckoutApiValues = z.infer<typeof checkoutSchema>;

// Типы для частичных данных черновиков
export type CheckoutDraftValues = z.infer<typeof checkoutDraftSchema>;
export type CheckoutDraftPartialValues = z.infer<typeof checkoutDraftPartialSchema>;
export type CheckoutContactInfoDraftValues = z.infer<typeof checkoutContactInfoDraftSchema>;
export type CheckoutShippingAddressDraftValues = z.infer<typeof checkoutShippingAddressDraftSchema>;
export type CheckoutShippingMethodDraftValues = z.infer<typeof checkoutShippingMethodDraftSchema>;
export type CheckoutPaymentMethodDraftValues = z.infer<typeof checkoutPaymentMethodDraftSchema>;

// Типы для результатов валидации
export type DraftValidationResult = {
  isValid: boolean;
  data: CheckoutDraftPartialValues | null;
  errors: any[] | null;
};
