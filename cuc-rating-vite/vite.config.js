import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport, { VantResolve } from "vite-plugin-style-import";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  server: {
    host: "0.0.0.0",
    proxy: {
      ['/dev-api']: {
        target: "http://1.116.216.160:8000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      },
    },
  },
});
