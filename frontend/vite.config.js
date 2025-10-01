import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // default dev server port
  },
  resolve: {
    alias: {
      '@': '/src', // shorthand for src folder
      '@admin': '/src/admin', // shorthand for admin folder
    },
  },
})
