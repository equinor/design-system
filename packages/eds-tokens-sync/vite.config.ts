/* eslint-disable import/no-default-export */

import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      name: 'eds-tokens-sync',
      entry: [
        resolve(__dirname, 'src/main.ts'),
        resolve(__dirname, 'src/scripts/sync_figma_to_tokens.ts'),
      ],
    },
    rollupOptions: {
      external: [
        '@figma/rest-api-spec',
        'dotenv',
        'axios',
        'fs',
        'path',
        'os',
        'crypto',
      ],
      output: {
        globals: {
          '@figma/rest-api-spec': '@figma/rest-api-spec',
          dotenv: 'dotenv',
          axios: 'axios',
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
