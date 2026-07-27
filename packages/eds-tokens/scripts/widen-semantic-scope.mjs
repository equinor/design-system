/**
 * Widen the semantic layer's selector from `:root` to
 * `:root, [data-color-scheme]` so semantic tokens re-resolve inside
 * `[data-color-scheme]` subtrees (#5226).
 *
 * The semantic layer references the scale aliases (`--eds-accent-N`,
 * `--eds-neutral-N`, …) that only exist under the
 * `[data-color-scheme="light"|"dark"]` scope rules, and CSS custom
 * properties substitute where they are *declared* — declared only at
 * `:root`, the semantic tokens resolve once at the root and subtree
 * colour-scheme switching never reaches them.
 *
 * Only the semantic layer is widened. The CSS export's `rootSelector`
 * is global across all non-dimensional layers, and widening everything
 * regresses the density cascade: `density/comfortable.css` (the density
 * base) declares the same `--eds-density-*` names as the compact and
 * relaxed variants, so re-declaring it on every `[data-color-scheme]`
 * element clobbers a `[data-density]` ancestor's values for the whole
 * subtree. The export format has no per-layer selector, hence this
 * post-export step. It runs before generate-css-bundle.mjs (chained in
 * the `generate:css-bundle` package script).
 *
 * Known caveat, tracked in #5221: three names (`border-focus`,
 * `text-disabled`, `border-disabled`) are declared in both the
 * color-scheme layer and the semantic layer. On `[data-color-scheme]`
 * elements the widened semantic block wins those at equal specificity
 * (it sorts last in the bundle) — a token-content bug upstream, not a
 * consequence of this step.
 *
 * Idempotent; fails loudly if the semantic file is missing or does not
 * start with the expected selector.
 *
 * Usage: node scripts/widen-semantic-scope.mjs [--file <path>]
 */
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'

const args = parseArgs(process.argv.slice(2))
const FILE = args.file ?? 'src/tokens/css/semantic/default.css'

const NARROW = ':root {'
const WIDE = ':root, [data-color-scheme] {'

const css = await readFile(FILE, 'utf8').catch(() =>
  fail(`cannot read ${FILE}`),
)

if (css.startsWith(WIDE)) {
  console.log(`widen-semantic-scope: ${FILE} already widened`)
} else if (css.startsWith(NARROW)) {
  await writeFile(FILE, WIDE + css.slice(NARROW.length))
  console.log(`widen-semantic-scope: widened ${FILE} to "${WIDE.slice(0, -2)}"`)
} else {
  fail(
    `${FILE} does not start with "${NARROW}" — the export layout changed, review #5226 before proceeding`,
  )
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '')
    const value = argv[i + 1]
    if (!key || !value) fail(`invalid arguments: ${argv.join(' ')}`)
    out[key] = value
  }
  return out
}

function fail(message) {
  console.error(`widen-semantic-scope: ${message}`)
  process.exit(1)
}
