import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget.tsx'), 
      name: 'ReactWidget',
      fileName: 'react-widget-green-basic',
      formats: ['iife'], 
    },
//     rollupOptions: {
//       external: ['react', 'react-dom'],
//       output: {
//         globals: {
//           react: 'React',
//           'react-dom': 'ReactDOM',
//         },
//       },
//     },
  },
});