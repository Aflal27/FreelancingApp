import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      // Proxy for your backend API on localhost:8000
      "/api": {
        target: "http://localhost:8000", // Local server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/local/, "/api"), // Adjust path if necessary
        secure: false,
      },

      // Socket.IO for real-time connections
      "/socket.io": {
        target: "http://localhost:8000",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
