import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'
import { demoFixtures, demoWindow, stripLibraryKeys } from './vite-plugins'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * Builds the demo of the plugin window into demo/dist/index.html, one file
 * with the window inlined: the page around the window, with a stand-in for
 * the plugin main thread and a sample file, and the window itself, built
 * with the plugin's own vite.config.ts (vite-plugins.ts, demoWindow).
 */
export default defineConfig({
  root: here('./'),
  base: './',
  plugins: [stripLibraryKeys(), demoWindow(), demoFixtures(), viteSingleFile()],
  build: {
    outDir: here('./dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: here('./index.html'),
    },
  },
})
