import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fail } from './errors.js'

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
      let parsed: { version: string; exports?: unknown }
      try {
        parsed = JSON.parse(readFileSync(manifest, 'utf8')) as typeof parsed
      } catch {
        return fail(`Could not read ${manifest}: it is not valid JSON.`)
      }
      return { name, version: parsed.version, root, exports: parsed.exports }
    }
    const parent = dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

/** Whether the package's `exports` has `specifier` as a key */
export function hasExport(pkg: InstalledPackage, specifier: string): boolean {
  return (
    !!pkg.exports &&
    typeof pkg.exports === 'object' &&
    Object.hasOwn(pkg.exports, specifier)
  )
}

/**
 * The file a package specifier such as
 * `@equinor/eds-tokens/next/css/variables.css` resolves to for a file in
 * `cwd`, or null if the package does not export it. Node does the resolution,
 * so exact keys, the priority of patterns and `null` targets follow its rules.
 */
export function resolveExport(cwd: string, specifier: string): string | null {
  try {
    return createRequire(join(cwd, 'noop.js')).resolve(specifier)
  } catch {
    return null
  }
}

/** Reads a file the user or a package points to, with a clear error */
export function readTextFile(file: string): string {
  if (!existsSync(file)) return fail(`No such file: ${file}`)
  if (statSync(file).isDirectory()) {
    return fail(`${file} is a folder, not a file.`)
  }
  return readFileSync(file, 'utf8')
}
