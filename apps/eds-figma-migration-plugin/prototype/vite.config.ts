import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url))
const repoRoot = here('../../../')

/**
 * Builds the prototype for review into prototype/review: index.html, the shell
 * with the canvas and the mock plugin, and window.html, the plugin window
 * forked into prototype/src/ui. Both are single files, so they can be
 * opened straight from disk or shared as two files.
 *
 * `--mode window` builds the window, `--mode shell` the shell.
 */
export default defineConfig(({ mode }) => ({
  root: here('./'),
  plugins: [react(), viteSingleFile()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: /^@equinor\/eds-core-react\/next$/,
        replacement: `${repoRoot}packages/eds-core-react/dist/esm-next/index.next.js`,
      },
      {
        find: /^@equinor\/eds-core-react\/next\/index\.css$/,
        replacement: `${repoRoot}packages/eds-core-react/build/index.css`,
      },
      {
        find: /^@equinor\/eds-tokens\/next\/css\/variables\.css$/,
        replacement: `${repoRoot}packages/eds-tokens/src/tokens/css/variables.css`,
      },
    ],
  },
  build: {
    outDir: here('./review'),
    emptyOutDir: false,
    rollupOptions: {
      input: here(mode === 'shell' ? './index.html' : './window.html'),
    },
  },
}))
