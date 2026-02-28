import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
        headers: {
          "x-api-key": process.env.VITE_API_SECRET ?? "",
        },
      },
    },
  },
});