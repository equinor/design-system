import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

/**
 * Builds the plugin main thread into one file, dist/code.js. Figma runs it in
 * a sandbox without modules, so the output is a single IIFE. The syntax is
 * compiled down to ES2017, which the sandbox is documented to run.
 */
export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: false,
    target: 'es2017',
    minify: false,
    lib: {
      entry: fileURLToPath(new URL('./src/plugin/code.ts', import.meta.url)),
      formats: ['iife'],
      name: 'edsVariableMigration',
      fileName: () => 'code.js',
    },
  },
})
