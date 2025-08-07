import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(100, "Имя слишком длинное"),
  lastName: z
    .string()
    .min(2, "Фамилия должна содержать минимум 2 символа")
    .max(100, "Фамилия слишком длинная"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Неверный формат номера телефона",
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
