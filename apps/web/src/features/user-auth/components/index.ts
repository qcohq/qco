// Новые компоненты согласно правилам проекта

export { AuthError } from "./auth-error";
export { AuthGuard } from "./auth-guard";
export { AuthLayout } from "./auth-layout";
export { AuthSuccess } from "./auth-success";
export { ForgotPasswordForm } from "./forgot-password-form";

// Старые компоненты (для обратной совместимости)
export { LoginForm } from "./login-form";
export { PasswordInput } from "./password-input";
export { ProfileLayout } from "./profile-layout";
export { ProfileSkeleton } from "./profile-skeleton";
export { RegisterForm } from "./register-form";
export { SignOutButton } from "./sign-out-button";

import OrdersHistory from "./orders-history";
export { OrdersHistory };
export { AccountStats } from "./account-stats";
export { AddressesManagement } from "./addresses-management";
export { ProfileOverview } from "./profile-overview";
