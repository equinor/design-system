/**
 * Widen two selectors in the Tokens Studio CSS export, so tokens
 * re-resolve inside subtrees that change what they depend on.
 *
 * 1. The semantic layer, from `:root` to
 *    `:root, [data-color-scheme], [data-density]`.
 *
 *    The semantic layer references the scale aliases (`--eds-accent-N`,
 *    `--eds-neutral-N`, …) that only exist under the
 *    `[data-color-scheme="light"|"dark"]` scope rules, and the density
 *    layer (`--eds-density-*`) that changes under `[data-density]`. CSS
 *    custom properties substitute where they are *declared*. Declared
 *    only at `:root`, the semantic tokens resolve once at the root, and
 *    neither a colour-scheme subtree (#5226) nor a density subtree
 *    (#5247) reaches them: `--eds-spacing-md` stayed Comfortable inside
 *    `data-density="compact"`.
 *
 * 2. The density base, `density/comfortable.css`, from `:root` to
 *    `:root, [data-density="comfortable"]`. Compact and Relaxed export
 *    with their own `[data-density]` selector, but the base only
 *    existed at the root, so `data-density="comfortable"` inside a
 *    Compact subtree kept the Compact values.
 *
 * Nothing else is widened. The CSS export's `rootSelector` is global
 * across all non-dimensional layers, and widening everything regresses
 * the density cascade: the density base declares the same
 * `--eds-density-*` names as the compact and relaxed variants, so
 * re-declaring it on every `[data-color-scheme]` or `[data-density]`
 * element clobbers a `[data-density]` ancestor's values for the whole
 * subtree. That is why the base only gets its own attribute value. The
 * export format has no per-layer selector, hence this post-export step.
 * It runs before generate-css-bundle.mjs (chained in the
 * `generate:css-bundle` package script), and the bundler asserts the
 * widening happened (shared patterns in semantic-scope.mjs).
 *
 * Known caveat, tracked in #5221: three names (`border-focus`,
 * `text-disabled`, `border-disabled`) are declared in both the
 * color-scheme layer and the semantic layer — a token-content bug
 * upstream. On `[data-color-scheme]` elements both blocks now apply at
 * equal specificity; generate-css-bundle.mjs concatenates the
 * color-scheme files last so the scheme-specific values keep winning,
 * as they did before the widening (`--eds-border-focus` is the
 * focus-ring token, and the semantic copy is a self-reference that
 * would drop focus outlines).
 *
 * Every `semantic/*.css` file is widened, matching the bundler's
 * directory glob — a file the export adds later must not slip through
 * with the narrow selector. Idempotent; fails loudly if a file starts
 * with none of the narrow, the previous or the widened selector.
 *
 * Usage: node scripts/widen-semantic-scope.mjs [--dir <path>] [--density-base <file>]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import {
  DENSITY_BASE_WIDE,
  DENSITY_BASE_WIDE_RE,
  NARROW_RE,
  PREVIOUS_WIDE_RE,
  WIDE,
  WIDE_RE,
} from './semantic-scope.mjs'

const args = parseArgs(process.argv.slice(2))
const DIR = args.dir ?? 'src/tokens/css/semantic'
const DENSITY_BASE =
  args['density-base'] ?? 'src/tokens/css/density/comfortable.css'

// Recursive to mirror the bundler's directory glob — a nested file the
// export adds later must be widened too, not just top-level ones
const files = (
  await readdir(DIR, { recursive: true }).catch(() =>
    fail(`cannot read ${DIR}`),
  )
)
  .filter((file) => file.endsWith('.css'))
  .sort()

if (files.length === 0) fail(`no CSS files found under ${DIR}`)

for (const file of files) {
  await widen(join(DIR, file), {
    wide: WIDE,
    wideRe: WIDE_RE,
    from: [NARROW_RE, PREVIOUS_WIDE_RE],
  })
}

await widen(DENSITY_BASE, {
  wide: DENSITY_BASE_WIDE,
  wideRe: DENSITY_BASE_WIDE_RE,
  from: [NARROW_RE],
})

async function widen(path, { wide, wideRe, from }) {
  const css = await readFile(path, 'utf8').catch(() =>
    fail(`cannot read ${path}`),
  )
  if (wideRe.test(css)) {
    if (css.startsWith(wide)) {
      console.log(`widen-semantic-scope: ${path} already widened`)
    } else {
      // Tolerated on input, but normalise so the committed bytes are a
      // function of content only, whatever shape the selector arrived in
      await writeFile(path, css.replace(wideRe, wide))
      console.log(`widen-semantic-scope: normalised ${path}`)
    }
    return
  }
  const selector = from.find((re) => re.test(css))
  if (!selector)
    fail(
      `${path} does not start with a ":root" selector, so the export layout changed. Review #5226 and #5247 before proceeding`,
    )
  await writeFile(path, css.replace(selector, wide))
  console.log(`widen-semantic-scope: widened ${path}`)
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
