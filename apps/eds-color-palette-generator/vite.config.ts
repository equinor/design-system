import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'cli/generate-colors': resolve(__dirname, 'src/cli/generate-colors.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'node:fs',
        'node:fs/promises',
        'node:path',
        'node:process',
        'colorjs.io',
        'colorjs.io/fn',
      ],
      output: {
        banner: (chunk) => {
          if (chunk.name?.startsWith('cli/')) {
            return '#!/usr/bin/env node'
          }
          return ''
        },
      },
    },
    outDir: 'dist',
  },
  plugins: [dts({ rollupTypes: true })],
})
