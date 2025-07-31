import { emailOTPClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "./util";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    emailOTPClient(),
    adminClient(),
  ],
});

export const { signIn, signOut, useSession, emailOtp } = authClient;
