import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))

/**
 * Builds the plugin window into one file, dist/ui.html. Figma loads the UI as
 * a single HTML string, so vite-plugin-singlefile inlines the JS and CSS.
 *
 * The aliases point at the workspace builds of eds-core-react and eds-tokens,
 * so the plugin is built against main. Run `pnpm run build` at the repository
 * root first.
 */
export default defineConfig({
  root: fileURLToPath(new URL('./src/ui', import.meta.url)),
  plugins: [react(), viteSingleFile()],
  resolve: {
    // The aliased eds-core-react build resolves React from its own
    // node_modules; one copy is needed for hooks to work.
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        // `/next` is not in the committed exports map (#4395), so resolve it
        // to the build, as the docs site does.
        find: /^@equinor\/eds-core-react\/next$/,
        replacement: `${repoRoot}packages/eds-core-react/dist/esm-next/index.next.js`,
      },
      {
        find: /^@equinor\/eds-core-react\/next\/index\.css$/,
        replacement: `${repoRoot}packages/eds-core-react/build/index.css`,
      },
      {
        // The Tokens Studio bundle is only exported on the beta line.
        find: /^@equinor\/eds-tokens\/next\/css\/variables\.css$/,
        replacement: `${repoRoot}packages/eds-tokens/src/tokens/css/variables.css`,
      },
    ],
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: false,
    rollupOptions: {
      input: fileURLToPath(new URL('./src/ui/ui.html', import.meta.url)),
    },
  },
})
