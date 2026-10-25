import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    projects: [
      { test: { name: "unit", include: ["packages/**/*.test.ts", "apps/**/*.test.ts"] } },
      {
        extends: true,
        resolve: { alias: { "react-native": "react-native-web" } },
        oxc: { jsx: { runtime: "automatic" } },
        test: {
          name: "integration",
          environment: "jsdom",
          include: ["apps/**/*.test.tsx", "tests/integration/*.test.tsx"],
          setupFiles: [fileURLToPath(new URL("./tests/integration/setup.ts", import.meta.url))],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["packages/core/src/**/*.ts", "apps/mobile/src/screens/**/*.tsx", "apps/mobile/src/storage/InitialProfileStorage.ts"],
      exclude: ["**/*.test.*", "**/integration/**"],
      reporter: ["text", "json-summary", "json", "lcov"],
    },
  },
});
