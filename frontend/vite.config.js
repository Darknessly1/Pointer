import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:6000', // Your backend API URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional rewrite rule
      },
    },
  },

})