import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Prefer TS sources over accidentally generated JS siblings in src/
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"]
  }
});
