import { fileURLToPath } from "node:url";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    "@qco/api",
    "@qco/auth",
    "@qco/db",
    "@qco/ui",
    "@qco/validators",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.timeweb.cloud",
        port: "",
        search: "",
      },
    ],
  },
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  output: "standalone",
};

export default config;
