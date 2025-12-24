import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: './localhost.pem',
      key: './localhost-key.pem'
    },
    proxy: {
      '/invoice-generator': {
        target: 'https://apps.ddhost.in',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
