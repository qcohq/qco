import { appRouter, createTRPCContext } from "@qco/web-api";
import { auth } from "@qco/web-auth";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      router: appRouter,
      req,
      createContext: async () => {
        const session = await auth.api.getSession({
          headers: req.headers,
          query: {
            disableRefresh: false,
          },
        });

        return createTRPCContext({
          headers: req.headers,
          session,
        });
      },
      onError({ error, path, type, ctx }) {
        console.error(`>>> tRPC Error on '${path}' (${type})`, {
          error: error.message,
          code: error.code,
          cause: error.cause,
          ctx: ctx ? "context available" : "no context",
        });
      },
    });

    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error(">>> tRPC Handler Error:", error);

    const errorResponse = new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Stream closed or request failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    setCorsHeaders(errorResponse);
    return errorResponse;
  }
};

export { handler as GET, handler as POST };
