import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxy les requêtes API vers Vercel en développement
    // En production, les routes /api sont gérées par Vercel automatiquement
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
        changeOrigin: true,
        // Si vous utilisez Vercel CLI localement, utilisez:
        // target: 'http://localhost:3000',
      },
    },
  },
})
