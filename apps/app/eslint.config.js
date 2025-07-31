import baseConfig, { restrictEnvAccess } from "@qco/eslint-config/base";
import nextjsConfig from "@qco/eslint-config/nextjs";
import reactConfig from "@qco/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
