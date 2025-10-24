import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.',
  server: {
    open: '/index.html',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [tailwindcss()],
})
