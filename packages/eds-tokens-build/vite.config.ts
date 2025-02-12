/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/no-default-export */

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      name: 'eds-tokens-build',
      entry: 'src/index.ts',
    },
    rollupOptions: {
      external: [
        'style-dictionary',
        'style-dictionary-utils',
        'fs',
        'path',
        'os',
        'crypto',
      ],
      output: {
        globals: {
          'style-dictionary': 'StyleDictionary',
          'style-dictionary-utils': 'StyleDictionaryUtils',
          fs: 'fs',
          path: 'path',
          os: 'os',
          crypto: 'crypto',
        },
      },
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
})
