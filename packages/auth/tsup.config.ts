import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "index": "src/index.ts",
        "index.rsc": "src/index.rsc.ts",
        "client": "src/client.ts",
        "middleware": "src/middleware.ts",
        "util": "src/util.ts",
    },
    format: ["esm"],
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: false,
    external: [
        "@qco/db",
        "@qco/emails",
        "@t3-oss/env-nextjs",
        "better-auth",
        "next",
        "react",
        "react-dom",
        "zod"
    ],
}); 