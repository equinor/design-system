/**
 * Guard the Tokens Studio CSS export against colliding custom-property
 * names (#5407, ADR-0014 § Confirmation).
 *
 * The CSS name transform is not injective: both `.` and `-` in a token
 * path flatten to `-`, so `border.focus` and `border-focus` land on the
 * same custom property. Where one aliases the other the emitted
 * declaration is self-referential (`--eds-border-focus:
 * var(--eds-border-focus)`) and resolves to nothing — that is what
 * dropped the focus ring on Button and Chip in the beta. #5280 renamed
 * the three tokens that collided, but that was a token-content fix; the
 * transform is unchanged, so the same class of bug returns with any new
 * token name.
 *
 * Platform-side tooling cannot substitute for this: Tokens Studio
 * resolves by token name, where `border.focus` and `border-focus` are
 * distinct, so `studio` previews look healthy while the built CSS is
 * broken. The check has to run on the built CSS.
 *
 * Four rules over the generated files under `src/tokens/css/`:
 *
 * 1. Self-reference — `--eds-x: var(--eds-x)`. Resolves to nothing; the
 *    shape the beta focus-ring bug actually took.
 * 2. Shadowed inside one scope — the same name declared twice under the
 *    same selector in the same layer directory, whether in one file or
 *    across two. This is the flattening collision when both tokens come
 *    from the same export set: one value silently wins and rule 3 sees
 *    nothing, because both live in the same layer directory.
 * 3. Declared in more than one layer directory — e.g. `semantic/` and
 *    `color-scheme/`. Repeats *within* a directory are expected and
 *    ignored (light/dark, the three density modes): those are the same
 *    token in different modes. Across directories the bundle's source
 *    order is the only cascade lever, which is a collision waiting to
 *    be reordered.
 * 4. Shared with the legacy bundle — an app that loads both packages
 *    resolves a shared name to whichever bundle it imported last, with
 *    no warning anywhere. KNOWN_LEGACY_OVERLAP below is the list that
 *    has to be cleared before the `next/*` → `css/*` flip; anything
 *    outside it fails.
 *
 * Every rule collects all its violations before reporting: this runs
 * unattended in `tokens_studio_release.yaml`, where the Actions log is
 * the only place to diagnose a bad export, so stopping at the first hit
 * would cost a release cycle per collision.
 *
 * Usage: node scripts/assert-no-duplicate-names.mjs [--css <dir>] [--legacy <file|none>]
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import process from 'node:process'

const args = parseArgs(process.argv.slice(2))
const CSS_DIR = args.css ?? 'src/tokens/css'
const LEGACY_FILE = args.legacy ?? 'build/css/variables.min.css'
// The bundle is a concatenation of the other files (ADR-0010), so
// scanning it too would report every name as its own duplicate
const BUNDLE_FILE = join(CSS_DIR, 'variables.css')

/**
 * Names declared by both the legacy 2.x bundle and the new export, as
 * measured on `main` 2026-09-07 (#5407). A mixed app resolves all of
 * them to one bundle's value silently.
 *
 * Nothing is visibly broken today, for two different reasons. The
 * header sizes have no `/next` consumer at all (and differ slightly
 * between the two anyway — 3xl: 27.5px legacy vs 28px new; 4xl: 31.5px
 * vs 32px). `--eds-elevation-low` does have one — Dialog's
 * `box-shadow` (`next/Dialog/dialog.css`) — but both bundles resolve it
 * to the same two-layer geometry at the same alphas (the legacy hex
 * quantises the 0.12 ambient to 0.1216), so whichever wins looks
 * identical.
 *
 * The list may shrink, never grow. A cleared entry is reported as a
 * warning rather than a failure on purpose: a release must not be
 * blocked because a collision got *fixed* — that would fail the run and
 * open no PR for a healthy token set.
 */
const KNOWN_LEGACY_OVERLAP = [
  '--eds-elevation-high',
  '--eds-elevation-low',
  '--eds-typography-header-2xl-font-size',
  '--eds-typography-header-3xl-font-size',
  '--eds-typography-header-4xl-font-size',
  '--eds-typography-header-lg-font-size',
  '--eds-typography-header-md-font-size',
  '--eds-typography-header-sm-font-size',
  '--eds-typography-header-xl-font-size',
  '--eds-typography-header-xs-font-size',
]

const files = (
  await readdir(CSS_DIR, { recursive: true }).catch(() =>
    fail(
      `cannot read ${CSS_DIR} — run the export (or pass --css <dir>) before checking`,
    ),
  )
)
  .filter((file) => file.endsWith('.css'))
  .map((file) => join(CSS_DIR, file))
  .filter((file) => resolve(file) !== resolve(BUNDLE_FILE))
  .sort()

if (files.length === 0) fail(`no CSS files found under ${CSS_DIR}`)

const violations = []
/** name -> Map<layer directory, first `file:line` seen in it> */
const byLayer = new Map()
/**
 * name -> scope (layer directory + selector) -> first `file:line` in it,
 * to catch rule 2.
 *
 * Keyed per scope rather than holding only the last declaration: with
 * one entry per name, `:root { --eds-a } .x { --eds-a } :root
 * { --eds-a }` compares the third against `.x` and misses the
 * shadowing.
 *
 * Spans files instead of resetting per file, because two files in the
 * same layer directory under the same selector shadow each other
 * exactly like two blocks in one file — and rule 3 cannot see it, since
 * repeats within a directory are expected there. No two files in a
 * directory share a selector in today's export (light/dark and the
 * three density modes all differ), but widen-semantic-scope.mjs expects
 * the export to add files to `semantic/` later.
 */
const seenInScope = new Map()

for (const file of files) {
  const layer = relative(CSS_DIR, file).split(sep)[0]
  const declarations = parseDeclarations(await readFile(file, 'utf8'))

  for (const { name, value, block, line } of declarations) {
    if (selfReferences(name, value))
      violations.push(
        `self-reference: ${file}:${line} declares ${name}: ${value} — resolves to nothing`,
      )

    // \u0000 cannot occur in a path or a selector, so it cannot make two
    // different scopes collide into one key
    const scope = `${layer}\u0000${block}`
    if (!seenInScope.has(name)) seenInScope.set(name, new Map())
    const scopes = seenInScope.get(name)
    const previous = scopes.get(scope)
    if (previous !== undefined)
      violations.push(
        `shadowed declaration: ${file}:${line} redeclares ${name} inside "${block}" (first at ${previous}) — one value wins silently`,
      )
    else scopes.set(scope, `${file}:${line}`)

    if (!byLayer.has(name)) byLayer.set(name, new Map())
    const layers = byLayer.get(name)
    if (!layers.has(layer)) layers.set(layer, `${file}:${line}`)
  }
}

for (const [name, layers] of byLayer) {
  if (layers.size < 2) continue
  const where = [...layers.values()].join(', ')
  violations.push(
    `declared in ${layers.size} layer directories: ${name} (${where}) — source order in the bundle decides which one wins`,
  )
}

if (LEGACY_FILE !== 'none') {
  // Committed, so present after a plain checkout — but `pnpm run clean`
  // rimrafs build/, and a silently skipped rule is no rule
  const legacyCss = await readFile(LEGACY_FILE, 'utf8').catch(() =>
    fail(
      `cannot read ${LEGACY_FILE} — run "pnpm run build:variables" to restore it, or pass --legacy none to skip the legacy-overlap rule`,
    ),
  )
  const legacy = new Set(parseDeclarations(legacyCss).map(({ name }) => name))
  const shared = [...byLayer.keys()].filter((name) => legacy.has(name)).sort()
  const known = new Set(KNOWN_LEGACY_OVERLAP)

  for (const name of shared.filter((name) => !known.has(name)))
    violations.push(
      `shared with the legacy bundle: ${name} is declared by both ${LEGACY_FILE} and the new export — an app loading both resolves it to whichever it imported last`,
    )

  // Filtered against the overlap, not against the legacy side of it:
  // the legacy 2.x bundle is frozen, so in practice a collision is
  // cleared by renaming in the new export, where `legacy` still has
  // the name and a legacy-only test would never fire
  const stillShared = new Set(shared)
  const cleared = KNOWN_LEGACY_OVERLAP.filter((name) => !stillShared.has(name))
  if (cleared.length > 0)
    console.warn(
      `assert-no-duplicate-names: ${cleared.length} name(s) in KNOWN_LEGACY_OVERLAP no longer overlap and can be removed from the list: ${cleared.join(', ')}`,
    )
}

if (violations.length > 0)
  fail(
    `${violations.length} colliding custom-property name(s) in ${CSS_DIR}:\n  ${violations.join('\n  ')}`,
  )

console.log(
  `assert-no-duplicate-names: checked ${byLayer.size} names across ${files.length} files under ${CSS_DIR} — no collisions`,
)

/**
 * Lightweight declaration scanner. Tracks the selector stack so nesting
 * (`@layer eds-tokens { :root { … } }`, proposed in #5423) keeps
 * declarations attributed to the block they are actually in, and
 * flushes on `}` as well as `;` so the last declaration of a minified
 * block is not dropped — the legacy bundle is minified.
 *
 * Tuned to the generated export: no strings containing braces or
 * semicolons, which a full CSS parser would be needed for.
 */
function parseDeclarations(css) {
  const source = stripComments(css)
  const declarations = []
  const stack = []
  let buffer = ''
  let line = 1

  const flush = () => {
    const text = buffer.trim()
    buffer = ''
    const colon = text.indexOf(':')
    if (colon < 1) return
    const name = text.slice(0, colon).trim()
    if (!name.startsWith('--eds-')) return
    declarations.push({
      name,
      value: text.slice(colon + 1).trim(),
      block: stack.join(' > '),
      line,
    })
  }

  for (const character of source) {
    if (character === '\n') line += 1
    if (character === '{') {
      stack.push(buffer.trim().replace(/\s+/g, ' '))
      buffer = ''
    } else if (character === '}') {
      flush()
      stack.pop()
    } else if (character === ';') {
      flush()
    } else {
      buffer += character
    }
  }

  return declarations
}

/** Blank out comments while keeping newlines, so line numbers hold. */
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, ''),
  )
}

function selfReferences(name, value) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`var\\(\\s*${escaped}\\s*[,)]`).test(value)
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
  console.error(`assert-no-duplicate-names: ${message}`)
  process.exit(1)
}
