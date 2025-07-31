import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./config";

export const getSession = async () =>
  cache(auth.api.getSession)({
    headers: await headers(),
    query: {
      disableRefresh: true,
    },
  });

export * from "./config";
