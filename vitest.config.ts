import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["domain/**/*.test.ts", "app/**/*.test.ts", "app/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: [
        "domain/spots.ts",
        "domain/layout.ts",
        "domain/categories.ts",
        "domain/kpi.ts",
        "domain/tap-store.ts",
        "app/guide-map.tsx",
        "app/api/spot-taps/route.ts",
      ],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "data/**", "e2e/**"],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 80,
      },
    },
  },
});
