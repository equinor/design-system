import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export type InstalledPackage = {
  name: string
  version: string
  root: string
  /** The `exports` field of the package's manifest */
  exports?: unknown
}

/**
 * Finds a package the way Node does for a file in `cwd`: in `node_modules`
 * of `cwd` or of the nearest parent that has it.
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
      const { version, exports } = JSON.parse(
        readFileSync(manifest, 'utf8'),
      ) as { version: string; exports?: unknown }
      return { name, version, root, exports }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

// The file an export target points to: a path, or the `default` condition.
const exportTarget = (value: unknown): string | null =>
  typeof value === 'string'
    ? value
    : value && typeof value === 'object' && 'default' in value
      ? exportTarget(value.default)
      : null

/**
 * The file an export specifier such as `./css/variables.css` points to, or
 * null if the package does not export it. Handles plain paths, patterns with
 * one `*` and the `default` condition, which covers how EDS exports files.
 */
export function exportPath(
  pkg: InstalledPackage,
  specifier: string,
): string | null {
  if (!pkg.exports || typeof pkg.exports !== 'object') return null
  for (const [key, value] of Object.entries(pkg.exports)) {
    const target = exportTarget(value)
    if (!target) continue
    if (key === specifier) return join(pkg.root, target)
    const [prefix, suffix] = key.split('*')
    if (
      suffix !== undefined &&
      specifier.length >= prefix.length + suffix.length &&
      specifier.startsWith(prefix) &&
      specifier.endsWith(suffix)
    ) {
      const match = specifier.slice(
        prefix.length,
        specifier.length - suffix.length,
      )
      // Node replaces every * in the target, not only the first.
      return join(pkg.root, target.replaceAll('*', match))
    }
  }
  return null
}
