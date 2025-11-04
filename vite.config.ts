
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
        drop_console: true,    // 👈 removes all console.* calls
        drop_debugger: true,   // 👈 removes all debugger statements
      },
    },
  },
});

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });
