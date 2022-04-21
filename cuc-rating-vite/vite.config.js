import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport, { VantResolve } from "vite-plugin-style-import";
import * as path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      '@':path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  server:{
    host:"0.0.0.0",
  }
});
