// Empties dist/ before a build. Both Vite builds write into the same folder
// (code.js and ui.html), so neither of them may empty it on its own.
import { rmSync } from 'node:fs'

rmSync(new URL('../dist', import.meta.url), { recursive: true, force: true })
