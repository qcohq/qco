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
        "@qco/auth",
        "@qco/db",
        "@qco/lib",
        "@qco/web-validators",
        "@trpc/server",
        "superjson",
        "zod"
    ],
}); 