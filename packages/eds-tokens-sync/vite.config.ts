/* eslint-disable import/no-default-export */

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: resolve(__dirname, 'src/main.ts'),
        sync_figma_to_tokens: resolve(
          __dirname,
          'src/scripts/sync_figma_to_tokens.ts',
        ),
        sync_tokens_to_figma: resolve(
          __dirname,
          'src/scripts/sync_tokens_to_figma.ts',
        ),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['fs', 'path'], // Keep only Node.js built-ins as external
    },
  },
  plugins: [dts({ rollupTypes: true })],
})
