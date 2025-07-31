import reactPlugin from "eslint-plugin-react";
import * as reactHooks from "eslint-plugin-react-hooks";

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': "error",
      'react-hooks/exhaustive-deps': "warn"
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
    },
    languageOptions: {
      globals: {
        React: "writable",
      },
    },
  },
];
