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
    rolldownOptions: {
      external: [
        /^node:/,
        'fs',
        'path',
        'os',
        'crypto',
        'process',
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
  plugins: [
    dts({
      bundleTypes: true,
      // The CLI's types need no tests; test helpers do not even emit cleanly
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/test/**',
      ],
    }),
  ],
})
