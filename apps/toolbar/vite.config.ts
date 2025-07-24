import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/embed.tsx"),
      name: "RelayKitToolbar",
      fileName: () => "relaykit-toolbar.js",
      formats: ["umd"],
    },
    // Remove rollupOptions.external and rollupOptions.output.globals to bundle React and ReactDOM
    minify: true,
    outDir: "dist-embed",
    emptyOutDir: true,
  },
});
