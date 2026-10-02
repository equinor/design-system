import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'generate-variables',
      fileName: 'generate-variables',
      entry: 'src/generate-variables/index.ts',
    },
    rolldownOptions: {
      output: {
        dir: 'build-generate-variables',
      },
      external: [
        /^node:/,
        'fs',
        'path',
        'os',
        'crypto',
        'process',
        'style-dictionary',
        'style-dictionary-utils',
        '@equinor/eds-tokens-sync',
        '@equinor/eds-tokens-build',
      ],
    },
  },
})
