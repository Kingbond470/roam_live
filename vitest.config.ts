import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest config for Nearaway unit tests.
 *
 * Scope is the pure-logic modules under `src/lib`. Playwright owns the
 * `e2e/` dir — it is excluded here so the two runners never collide.
 * The `@/*` alias mirrors tsconfig.json so imports resolve identically.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
