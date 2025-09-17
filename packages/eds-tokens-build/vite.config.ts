/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable import/no-default-export */

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      name: 'main',
      entry: 'src/main.ts',
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'os',
        'crypto',
        'style-dictionary',
        'style-dictionary-utils',
      ],
    },
  },
  plugins: [dts()],
})
