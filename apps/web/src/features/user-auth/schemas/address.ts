import { z } from "zod";

export const addressFormSchema = z.object({
  addressLine1: z
    .string()
    .min(5, "Адрес должен содержать минимум 5 символов")
    .max(200, "Адрес слишком длинный"),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(2, "Город должен содержать минимум 2 символа")
    .max(100, "Название города слишком длинное"),
  state: z
    .string()
    .min(2, "Регион должен содержать минимум 2 символа")
    .max(100, "Название региона слишком длинное")
    .optional(),
  postalCode: z
    .string()
    .min(5, "Почтовый индекс должен содержать минимум 5 символов")
    .max(10, "Почтовый индекс слишком длинный"),
  country: z
    .string()
    .min(2, "Страна должна содержать минимум 2 символа")
    .max(100, "Название страны слишком длинное"),
  isPrimary: z.boolean().default(false).optional(),
  notes: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
