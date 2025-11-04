import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'generate-variables',
      fileName: 'generate-variables',
      entry: 'src/generate-variables/index.ts',
    },
    rollupOptions: {
      output: {
        dir: 'build-generate-variables',
      },
      external: [
        'fs',
        'path',
        'os',
        'crypto',
        'style-dictionary',
        'style-dictionary-utils',
        '@equinor/eds-tokens-sync',
        '@equinor/eds-tokens-build',
      ],
    },
  },
})
