import { z } from "zod";

// Enum для роли администратора
export const adminRoleEnum = z.enum(["super_admin", "admin", "moderator", "editor"]);

// Enum для статуса приглашения
export const invitationStatusEnum = z.enum(["pending", "accepted", "expired", "cancelled"]);

// Схема для создания супер-администратора
export const createSuperAdminSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

// Схема для создания администратора
export const createAdminSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255),
  email: z.string().email("Некорректный email"),
  role: adminRoleEnum.default("admin"),
  isActive: z.boolean().default(true),
});

// Схема для обновления администратора
export const updateAdminSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255).optional(),
  email: z.string().email("Некорректный email").optional(),
  role: adminRoleEnum.optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов").optional(),
});

// Схема для получения администраторов с фильтрацией
export const getAdminsSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().optional(),
  role: adminRoleEnum.optional(),
  isActive: z.boolean().optional(),
});

// Схема для получения администратора по ID
export const getAdminByIdSchema = z.object({
  id: z.string(),
});

// Схема для удаления администратора
export const deleteAdminSchema = z.object({
  id: z.string(),
});

// Схема для массового удаления администраторов
export const bulkDeleteAdminsSchema = z.object({
  ids: z.array(z.string()).min(1, "Необходимо выбрать хотя бы одного администратора"),
});

// Схема для создания приглашения администратора
export const createAdminInvitationSchema = z.object({
  email: z.string().email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255).optional(),
  role: adminRoleEnum.default("admin"),
  expiresInDays: z.number().min(1).max(30).default(7), // Срок действия приглашения в днях
});

// Схема для получения приглашений с фильтрацией
export const getAdminInvitationsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  search: z.string().optional(),
  status: invitationStatusEnum.optional(),
  sortBy: z
    .enum(["email", "name", "createdAt", "expiresAt", "status"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

// Схема для получения приглашения по ID
export const getAdminInvitationByIdSchema = z.object({
  id: z.string(),
});

// Схема для отмены приглашения
export const cancelAdminInvitationSchema = z.object({
  invitationId: z.string().min(1, "ID приглашения обязателен"),
});

// Схема для повторной отправки приглашения
export const resendAdminInvitationSchema = z.object({
  invitationId: z.string().min(1, "ID приглашения обязателен"),
});

// Схема для принятия приглашения (используется на фронтенде)
export const acceptAdminInvitationSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255),
});

// Схема для изменения роли администратора
export const changeAdminRoleSchema = z.object({
  id: z.string(),
  role: adminRoleEnum,
});

// Схема для активации/деактивации администратора
export const toggleAdminStatusSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
});

// Схема для сброса пароля администратора
export const resetAdminPasswordSchema = z.object({
  id: z.string(),
});

// Схема для изменения пароля администратора
export const changeAdminPasswordSchema = z.object({
  id: z.string(),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

// Схема для получения статистики администраторов
export const getAdminsStatsSchema = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("month"),
});


// Типы для TypeScript
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type CreateAdminInvitationInput = z.infer<typeof createAdminInvitationSchema>;
export type AcceptAdminInvitationInput = z.infer<typeof acceptAdminInvitationSchema>;
export type AdminRole = z.infer<typeof adminRoleEnum>;
export type InvitationStatus = z.infer<typeof invitationStatusEnum>; 
