import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/vitest.setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      // Exclude test files and configuration files from coverage
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.{idea,git,cache,github}/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc}.config.*",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/__tests__/**",
        "**/__mocks__/**",
      ],
      // Enable all coverage reporters
      all: true,
      // Include files that have no tests
      include: ["src/**/*.{ts,tsx}"],
    },

    // Test timeout
    testTimeout: 10000,

    // Watch mode configuration
    watch: false,

    // Reporter configuration
    reporters: ["default", "html"],

    // Enable parallel test execution
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
});
