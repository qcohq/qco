import { defineConfig } from "tsup";
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

export default defineConfig({
  entry: ["./emails/**/*.ts", "index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: isProduction,
  external: ["react"],
});
