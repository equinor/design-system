/* eslint-disable import/no-default-export */

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        'scripts/build-color-scheme-variables': resolve(
          __dirname,
          'src/scripts/build-color-scheme-variables.ts',
        ),
        'scripts/build-semantic-dynamic-variables': resolve(
          __dirname,
          'src/scripts/build-semantic-dynamic-variables.ts',
        ),
        'scripts/build-semantic-static-variables': resolve(
          __dirname,
          'src/scripts/build-semantic-static-variables.ts',
        ),
        'scripts/generate-color-scheme-tokens': resolve(
          __dirname,
          'src/scripts/generate-color-scheme-tokens.ts',
        ),
        'scripts/generate-concept-tokens': resolve(
          __dirname,
          'src/scripts/generate-concept-tokens.ts',
        ),
        'scripts/generate-dynamic-appearance-tokens': resolve(
          __dirname,
          'src/scripts/generate-dynamic-appearance-tokens.ts',
        ),
        'scripts/generate-semantic-tokens': resolve(
          __dirname,
          'src/scripts/generate-semantic-tokens.ts',
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:path', 'node:process'], // Keep Node.js built-ins as external
      output: {
        banner: (chunk) => {
          // Add shebang for script files
          if (chunk.name?.startsWith('scripts/')) {
            return '#!/usr/bin/env node'
          }
          return ''
        },
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
})
