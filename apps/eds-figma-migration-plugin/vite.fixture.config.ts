import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

/**
 * Builds dist/collect-fixture.js: the scanner's reader and the fixture export
 * as one script that defines `edsCollectFixture(nodeId)`. It is for exporting
 * a test fixture with a tool that runs Plugin API code, without importing the
 * plugin into Figma. Minified, so it fits in such a tool's code limit.
 */
export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: false,
    target: 'es2017',
    lib: {
      entry: fileURLToPath(
        new URL('./src/plugin/dev/fixture-entry.ts', import.meta.url),
      ),
      formats: ['iife'],
      name: 'edsCollectFixtureBundle',
      fileName: () => 'collect-fixture.js',
    },
  },
})
