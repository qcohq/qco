import type { AdminRole } from "@qco/validators";

export const getRoleBadgeVariant = (role: AdminRole) => {
  switch (role) {
    case "super_admin":
      return "destructive" as const;
    case "admin":
      return "default" as const;
    case "moderator":
      return "secondary" as const;
    case "editor":
      return "outline" as const;
    default:
      return "outline" as const;
  }
};

export const getRoleLabel = (role: AdminRole) => {
  switch (role) {
    case "super_admin":
      return "Супер-админ";
    case "admin":
      return "Администратор";
    case "moderator":
      return "Модератор";
    case "editor":
      return "Редактор";
    default:
      return role;
  }
};

export const getStatusBadgeVariant = (isActive: boolean) => {
  return isActive ? ("default" as const) : ("secondary" as const);
};

export const getStatusLabel = (isActive: boolean) => {
  return isActive ? "Активен" : "Неактивен";
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ru-RU");
};
