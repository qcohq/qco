import { createAuthClient } from "better-auth/client";

import { getBaseUrl } from "./util";

export const client = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [],
});
