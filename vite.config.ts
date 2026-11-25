import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // relative paths so the same build works inside the Android app and on any web host
  test: { environment: "node" },
});
