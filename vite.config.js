import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  build: {
    outDir: 'dist',
  },
  base: '/reactexams/',  // Add this line
  server: {
    proxy: {
      "/api": {
        target: "https://api.razzakfashion.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
