/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/no-default-export */

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'os',
        'crypto',
        'style-dictionary',
        'style-dictionary-utils',
        '@equinor/eds-tokens-sync',
      ],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
})
