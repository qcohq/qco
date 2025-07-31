import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "./util";

// Создаем клиент аутентификации
export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [emailOTPClient()],
});
