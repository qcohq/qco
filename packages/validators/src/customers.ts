import { z } from "zod";

// Схема валидации для создания клиента
export const createCustomerSchema = z.object({
  email: z.string().email({
    error: "Пожалуйста, введите корректный email",
  }),
  name: z.string().optional(),
  firstName: z.string().min(2, {
    error: "Имя должно содержать не менее 2 символов",
  }).optional(),
  lastName: z.string().min(2, {
    error: "Фамилия должна содержать не менее 2 символов",
  }).optional(),
  phone: z.string().min(10, {
    error: "Телефон должен содержать не менее 10 символов",
  }).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.string().optional(),
  image: z.string().optional(),
  isGuest: z.boolean().optional(),
});

// Схема валидации для обновления клиента
export const updateCustomerSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string().optional(),
    firstName: z.string().min(2, {
      error: "Имя должно содержать не менее 2 символов",
    }).optional(),
    lastName: z.string().min(2, {
      error: "Фамилия должна содержать не менее 2 символов",
    }).optional(),
    email: z.string().email({
      error: "Пожалуйста, введите корректный email",
    }).optional(),
    phone: z.string().min(10, {
      error: "Телефон должен содержать не менее 10 символов",
    }).optional(),
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
    image: z.string().optional(),
    addresses: z.array(z.object({
      type: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      company: z.string().optional(),
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string().optional(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string().optional(),
      isDefault: z.boolean().optional(),
      notes: z.string().optional(),
    })).optional(),
  }),
});

// Схема валидации для получения клиента по ID
export const getCustomerByIdSchema = z.object({
  id: z.string(),
});

// Схема валидации для удаления клиента
export const deleteCustomerSchema = z.object({
  id: z.string(),
});

// Схема валидации для фильтрации клиентов
export const filterCustomersSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(12),
  registrationDate: z.date().nullable().optional(),
  orderCountMin: z.number().optional(),
  orderCountMax: z.number().optional(),
  spentAmountMin: z.number().optional(),
  spentAmountMax: z.number().optional(),
  showActive: z.boolean().optional().default(true),
  showInactive: z.boolean().optional().default(true),
  isVip: z.boolean().optional(),
  search: z.string().optional(),
});

// Экспорт типов для использования в других частях приложения
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type GetCustomerByIdInput = z.infer<typeof getCustomerByIdSchema>;
export type DeleteCustomerInput = z.infer<typeof deleteCustomerSchema>;
export type FilterCustomersInput = z.infer<typeof filterCustomersSchema>;
