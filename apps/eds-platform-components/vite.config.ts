import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'next',
        '@equinor/eds-core-react',
        '@equinor/eds-icons',
        '@equinor/eds-tokens',
        '@equinor/eds-utils',
      ],
    },
    outDir: 'dist',
  },
  plugins: [dts({ rollupTypes: true })],
})
