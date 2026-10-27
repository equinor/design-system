import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export type InstalledPackage = {
  name: string
  version: string
  root: string
}

/**
 * Finds a package the way Node does for a file in `cwd`: in `node_modules`
 * of `cwd` or of the nearest parent that has it. The package's own `exports`
 * do not matter, because the CLI reads data files by path.
 */
export function findPackage(
  name: string,
  cwd: string,
): InstalledPackage | null {
  let dir = cwd
  for (;;) {
    const root = join(dir, 'node_modules', name)
    const manifest = join(root, 'package.json')
    if (existsSync(manifest)) {
      const { version } = JSON.parse(readFileSync(manifest, 'utf8')) as {
        version: string
      }
      return { name, version, root }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}
