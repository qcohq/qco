import { z } from "zod";

// Базовые сообщения об ошибках
const errorMessages = {
  required: (field: string) => `${field} обязателен`,
  email: 'Пожалуйста, введите корректный адрес электронной почты',
  password: {
    min: 'Пароль должен содержать минимум 8 символов',
    max: 'Пароль не должен превышать 100 символов',
    pattern: 'Пароль должен содержать буквы и цифры',
  },
  name: {
    min: 'Имя должно содержать минимум 2 символа',
    max: 'Имя не должно превышать 50 символов',
  },
};

// Схема для входа администратора
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
  password: z.string().min(1, { error: errorMessages.required('Пароль') }),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// Схема для создания супер-администратора
export const authCreateSuperAdminSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { error: errorMessages.name.min })
      .max(50, { error: errorMessages.name.max }),
    lastName: z
      .string()
      .min(2, { error: errorMessages.name.min })
      .max(50, { error: errorMessages.name.max }),
    email: z
      .string()
      .min(1, { error: errorMessages.required('Email') })
      .email({ error: errorMessages.email }),
    password: z
      .string()
      .min(8, { error: errorMessages.password.min })
      .max(100, { error: errorMessages.password.max })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { error: errorMessages.password.pattern }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type AuthCreateSuperAdminFormValues = z.infer<typeof authCreateSuperAdminSchema>;

// Схема для сброса пароля администратора
export const adminPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
});

export type AdminPasswordResetFormValues = z.infer<typeof adminPasswordResetSchema>;

// Схема для установки нового пароля администратора
export const adminNewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { error: errorMessages.password.min })
      .max(100, { error: errorMessages.password.max })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { error: errorMessages.password.pattern }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type AdminNewPasswordFormValues = z.infer<typeof adminNewPasswordSchema>;

// Схема для смены пароля администратора
export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: errorMessages.required('Текущий пароль') }),
    newPassword: z
      .string()
      .min(8, { error: errorMessages.password.min })
      .max(100, { error: errorMessages.password.max })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { error: errorMessages.password.pattern }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: 'Новые пароли не совпадают',
    path: ['confirmPassword'],
  });

export type AdminChangePasswordFormValues = z.infer<typeof adminChangePasswordSchema>;

// Схема для обновления профиля администратора
export const adminProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: errorMessages.name.min })
    .max(50, { error: errorMessages.name.max }),
  lastName: z
    .string()
    .min(2, { error: errorMessages.name.min })
    .max(50, { error: errorMessages.name.max }),
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

// Схема для принятия приглашения администратора
export const acceptInvitationSchema = z.object({
  token: z.string().min(1, { error: "Токен приглашения обязателен" }),
  firstName: z
    .string()
    .min(2, { error: errorMessages.name.min })
    .max(50, { error: errorMessages.name.max }),
  lastName: z
    .string()
    .min(2, { error: errorMessages.name.min })
    .max(50, { error: errorMessages.name.max }),
  password: z
    .string()
    .min(8, { error: errorMessages.password.min })
    .max(100, { error: errorMessages.password.max })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { error: errorMessages.password.pattern }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  error: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;

// Схема для сброса пароля (общая)
export const passwordResetSchema = z.object({
  email: z.string().min(1, { error: "Электронная почта обязательна" }).email({
    error: "Пожалуйста, введите корректный адрес электронной почты",
  }),
});

export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

// Схема для входа (общая)
export const loginSchema = z.object({
  email: z.string().min(1, { error: "Электронная почта обязательна" }).email({
    error: "Пожалуйста, введите корректный адрес электронной почты",
  }),
  password: z.string().min(1, { error: "Пароль обязателен" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
