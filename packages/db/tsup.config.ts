import { defineConfig } from "tsup";

export default defineConfig({
    entry: {
        "index": "src/index.ts",
        "client": "src/client.ts",
        "client-ws": "src/client-ws.ts",
        "schema": "src/schema.ts",
        "types": "src/types.ts",
    },
    format: ["esm"],
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: false,
    external: ["@qco/lib"],
    outDir: "dist",
}); 