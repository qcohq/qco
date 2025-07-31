import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: false,
    external: [
        "@aws-sdk/client-s3",
        "@aws-sdk/lib-storage",
        "@aws-sdk/s3-request-presigner",
        "@sindresorhus/slugify",
        "@t3-oss/env-core",
        "mime-types",
        "zod"
    ],
}); 