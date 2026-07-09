import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'styles'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
})
