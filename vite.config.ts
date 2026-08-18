import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    "process.env": {},
    global: "globalThis",
  },
  build: {
    target: "esnext",
    minify: "terser", // 👈 use Terser instead of default esbuild
    terserOptions: {
      compress: {
        drop_console: true, // 👈 removes all console.* calls
        drop_debugger: true, // 👈 removes all debugger statements
      },
    },
  },
  // server: {
  //   port: 5174,
  //   strictPort: true, // fail instead of auto-incrementing
  //   host: true, // expose on 0.0.0.0, needed for Docker/remote access
  // },
});

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });
