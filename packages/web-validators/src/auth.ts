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
  otp: 'Код должен содержать 6 цифр',
  name: {
    min: 'Имя должно содержать минимум 2 символа',
    max: 'Имя не должно превышать 50 символов',
  },
};

// Схема для входа по email/паролю
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
  password: z.string().min(1, { error: errorMessages.required('Пароль') }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Схема для регистрации
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, { error: errorMessages.name.min })
    .max(50, { error: errorMessages.name.max }),
  lastName: z
    .string()
    .max(50, { error: errorMessages.name.max })
    .optional(),
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
  password: z
    .string()
    .min(8, { error: errorMessages.password.min })
    .max(100, { error: errorMessages.password.max })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { error: errorMessages.password.pattern }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Схема для сброса пароля
export const passwordResetSchema = z.object({
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
});

export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

// Схема для установки нового пароля
export const newPasswordSchema = z
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

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;



// Схема для OTP кода
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, { error: errorMessages.otp })
    .regex(/^\d+$/, { error: 'Код должен содержать только цифры' }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// Схема для смены пароля
export const changePasswordSchema = z
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

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

// Схема для удаления аккаунта
export const deleteAccountSchema = z.object({
  password: z.string().min(1, { error: errorMessages.required('Пароль') }),
  confirmDelete: z.boolean().refine((val) => val === true, {
    error: "Необходимо подтвердить удаление аккаунта",
  }),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

// Схема для подтверждения email по токену
export const verifyEmailSchema = z.object({
  token: z.string().min(1, { error: "Токен подтверждения обязателен" }),
});

// Схема для повторной отправки email подтверждения
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, { error: errorMessages.required('Email') })
    .email({ error: errorMessages.email }),
});
