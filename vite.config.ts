import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  mode: isDev ? "development" : "production",
  build: {
    sourcemap: isDev,
    minify: !isDev,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        background: resolve(__dirname, "src/background/index.ts"),
        content: resolve(__dirname, "src/content/index.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  plugins: [
    react(),
    {
      name: "copy-manifest-and-icons",
      closeBundle() {
        // Copy manifest.json
        copyFileSync("public/manifest.json", "dist/manifest.json");

        // Copy popup.html from nested location to root
        try {
          copyFileSync("dist/src/popup/index.html", "dist/popup.html");
        } catch (e) {
          console.warn("Could not copy popup HTML file:", e);
        }

        // Copy icons to dist/icons/ (not dist/src/icons/)
        mkdirSync("dist/icons", { recursive: true });
        [16, 32, 48, 128, 256, 512].forEach((size) => {
          ["light", "dark"].forEach((theme) => {
            const src = `src/icons/icon-${theme}-${size}.png`;
            const dest = `dist/icons/icon-${theme}-${size}.png`;
            try {
              copyFileSync(src, dest);
            } catch {}
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
