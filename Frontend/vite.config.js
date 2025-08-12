import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: { // Add this server configuration
    proxy: {
      '/api': {
        target: 'https://blogify-backend-mpzv.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})


