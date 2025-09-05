/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-default-export */
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
