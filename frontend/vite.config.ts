/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // Enable compression in dev to better reflect real-world sizes
    headers: {
      "Cache-Control": "no-store",
    },
  },
  build: {
    // Re-enable modulePreload (was set to false, hurting LCP)
    modulePreload: true,
    // Use esbuild for fast, optimal minification
    minify: "esbuild",
    // Raise warning threshold for charting and 3D dependencies
    chunkSizeWarningLimit: 600,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
    globals: true,
  }
});
