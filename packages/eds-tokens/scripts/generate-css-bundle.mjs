/**
 * Bundle the Tokens Studio CSS export into one committed file.
 *
 * Concatenates every generated CSS file under `src/tokens/css/` into
 * `src/tokens/css/variables.css` (ADR-0010) and wraps the result in
 * `@layer eds-tokens` (ADR-0028 point 6, #5423). The wrap is one of the
 * two things the bundle adds, the other being the font fallback below:
 * inside the layer the generated files resolve
 * exactly as they do unlayered — every mode file is `:root`- or
 * attribute-scoped, `var()` references are late-bound, and `@layer`
 * changes neither. Files are concatenated in sorted path order to keep
 * the committed artifact deterministic.
 *
 * The layer is what makes a consumer override win without a specificity
 * fight: unlayered author CSS beats any layer, so a product retunes a
 * token with a plain `:root { --eds-*: … }`. The order statement is
 * emitted ahead of the layer block and names every EDS layer, not only
 * this one, because the first order declaration the browser sees fixes
 * the order and repeated ones are harmless — so this bundle and
 * `eds-core-react/src/components/next/index.css` can both open with the
 * same statement and neither has to load first. The two must stay
 * identical: a layer name missing from the winning statement is
 * appended last when it first appears, so dropping `eds-tokens-legacy`
 * here would hand legacy the top layer in any app that loads this
 * bundle first.
 *
 * The same rule cuts the other way against the *legacy* 2.x bundle,
 * which is unlayered and therefore beats this one on every shared
 * `--eds-*` name (the ten in KNOWN_LEGACY_OVERLAP in
 * assert-no-duplicate-names.mjs). An app that loads both bundles and
 * wants the new values has to put the legacy one in a lower layer
 * itself: `@import '@equinor/eds-tokens/css/variables'
 * layer(eds-tokens-legacy)`, with `eds-tokens-legacy` ahead of
 * `eds-tokens` in the order statement. Every stylesheet in this
 * repository that puts legacy on a Tokens Studio page does that, and
 * `src/__tests__/legacy-token-layer.test.ts` fails if one stops.
 * Emitting the published legacy bundle inside a
 * layer was rejected — it would change the cascade under every 2.x
 * consumer mid-major, to fix a problem only mixed apps have.
 *
 * The body is not re-indented inside the layer block. Indenting would
 * rewrite every line on the first run and leave each later release PR
 * diffing against a shifted file, for no effect on the CSS.
 *
 * The second addition: every `--eds-family-*` declaration gets a
 * generic `sans-serif` appended (#5701). The export names a single
 * typeface, `Inter` for UI and `Equinor` for headers, so an app that
 * does not load the font falls back to the browser default, which is a
 * serif in Chrome, Firefox, Safari and Edge. Every label and body
 * style, which is most of an interface, then renders in Times. Design
 * agreed on `sans-serif`.
 *
 * It happens here, in memory, and not in the committed export files,
 * because generate-ts-tokens.mjs takes its values from the same CSS
 * export: a fallback written into `css/font/default.css` would land in
 * the TypeScript modules, whose `fontFamily` feeds React Native and
 * takes a single family name (mobile moves onto that export in #5495).
 * Setting it in the Tokens Studio export configuration fails for the
 * same reason, and the Figma variable behind the token has to stay one
 * font name as well. The cost of keeping it here is that the granular
 * files published under `./next/css/*` keep the bare family; the
 * bundle is the documented entry point (ADR-0010).
 *
 * One caveat to "concatenation is conflict-free": the semantic layer is
 * widened to `:root, [data-color-scheme], [data-density]` before
 * bundling (see widen-semantic-scope.mjs, chained in the
 * `generate:css-bundle` script), so on `[data-color-scheme]` elements
 * it overlaps the color-scheme layer at equal specificity — and there,
 * source order is the only cascade lever. The color-scheme files are
 * therefore concatenated last (see the sort below). No name is declared
 * in both layers today and assert-no-duplicate-names.mjs fails the
 * release if one appears (#5407), so the ordering guards a class of bug
 * rather than a list of names.
 *
 * The sort reaches `[data-color-scheme]` elements only, and since
 * #5247 widened the semantic layer to `[data-density]` as well, that is
 * no longer everywhere the two can meet: an element carrying only
 * `data-density` matches the semantic block and not the color-scheme
 * one, so concatenating the scheme files last protects nothing there
 * and the assertion is the sole guard against an overlapping name.
 *
 * The bundle is deliberately NOT minified: the committed file stays a
 * pure function of the source files (no toolchain-version churn in
 * release-PR diffs, no third-party minifier in the pipeline) and diffs
 * stay reviewable line by line. Gzip closes most of the size gap, and
 * consumers that bundle minify with their own tooling anyway.
 *
 * The directory is globbed rather than hard-coded so future changes to
 * the export set are followed automatically; only the output file
 * itself is excluded.
 *
 * On the beta line the committed bundle is importable as
 * `@equinor/eds-tokens/next/css/variables.css` through the
 * `./next/css/*` wildcard that publish_tokens.yaml injects.
 *
 * Usage: node scripts/generate-css-bundle.mjs [--css <dir>] [--out <file>]
 */
import { execFileSync } from 'node:child_process'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { DENSITY_BASE_WIDE_RE, WIDE_RE } from './semantic-scope.mjs'

const args = parseArgs(process.argv.slice(2))
const CSS_DIR = args.css ?? 'src/tokens/css'
const OUT_FILE = args.out ?? join(CSS_DIR, 'variables.css')

// Path-independent on purpose: the committed bytes must be a pure
// function of the source file contents, never of how the script was
// invoked
const HEADER =
  '/* Do not edit directly — generated by scripts/generate-css-bundle.mjs (concatenation of the Tokens Studio CSS export, wrapped in @layer eds-tokens) */\n'

// ADR-0028 point 6. The order statement names every EDS layer, not just this
// one, so that either bundle can establish the order; the layer block
// then holds the whole concatenation. `eds-tokens-legacy` has to be in
// the list even though this bundle never emits into it: layer order is
// fixed by first declaration, and a name missing from it is appended
// *last* when it first appears, which would put the legacy bundle on
// top of everything instead of underneath.
const LAYER_ORDER =
  '@layer eds-tokens-legacy, eds-tokens, eds-elements, eds-components;\n'
const LAYER_OPEN = '@layer eds-tokens {\n'
const LAYER_CLOSE = '}\n'

// The generic family appended to the font-family tokens, and the names
// that must be there for that to have happened (#5701). The prefix is
// matched rather than the two names themselves, so a family added
// upstream is covered on its own; the required list turns a rename or a
// move into a failed run rather than a bundle that quietly ships
// without a fallback.
const FONT_FALLBACK = 'sans-serif'
const REQUIRED_FAMILY_NAMES = ['--eds-family-header', '--eds-family-ui']
const FAMILY_DECLARATION = /(--eds-family-[\w-]+):\s*([^;]+);/g

// The CSS generic families, so a stack that already ends in one, should
// the export ever ship its own fallback, is left alone instead of
// doubled
const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'math',
  'fangsong',
  'emoji',
])

// Colour-scheme scope rules are concatenated after everything else:
// should a name ever be declared in both layers, the scheme value must
// win on a [data-color-scheme] element (equal specificity, so source
// order is the only cascade lever), preserving the resolved values from
// before the widening. This is a standing invariant of ADR-0028, not a
// workaround for specific names: none overlap today, and
// assert-no-duplicate-names.mjs fails the release if one appears
// (#5407). The bug it guards against is concrete — the last overlap
// was --eds-border-focus, where the semantic copy was a self-reference,
// so letting the semantic block win dropped focus outlines inside
// scoped subtrees (cleared by #5280).
const layerRank = (file) =>
  relative(CSS_DIR, file).split(sep)[0] === 'color-scheme' ? 1 : 0
const files = (await readdir(CSS_DIR, { recursive: true }))
  .filter((file) => file.endsWith('.css'))
  .map((file) => join(CSS_DIR, file))
  .filter((file) => resolve(file) !== resolve(OUT_FILE))
  .sort((a, b) => layerRank(a) - layerRank(b) || a.localeCompare(b))

if (files.length === 0) fail(`no CSS files found under ${CSS_DIR}`)

const contents = await Promise.all(
  files.map(async (file) => [file, await readFile(file, 'utf8')]),
)

// The widen-semantic-scope.mjs step must have run first (it is chained
// before this script in the `generate:css-bundle` package script) —
// bundling an unwidened semantic layer would silently regress subtree
// colour-scheme switching (#5226) and density switching (#5247).
// Checked for every semantic/*.css file, mirroring the widen script's
// own glob.
for (const [file, css] of contents) {
  if (relative(CSS_DIR, file).split(sep)[0] !== 'semantic') continue
  if (!WIDE_RE.test(css))
    fail(
      `${file} is not widened to ":root, [data-color-scheme], [data-density]" — run scripts/widen-semantic-scope.mjs before bundling (or use the generate:css-bundle package script, which chains it)`,
    )
}

// The same step widens the density base. Without it,
// data-density="comfortable" inside a Compact or Relaxed subtree keeps
// the ancestor's values (#5247).
const densityBase = contents.find(
  ([file]) => relative(CSS_DIR, file) === join('density', 'comfortable.css'),
)
if (!densityBase)
  fail(
    `no density/comfortable.css under ${CSS_DIR}, so the export layout changed. Review #5247 before proceeding`,
  )
if (!DENSITY_BASE_WIDE_RE.test(densityBase[1]))
  fail(
    `${densityBase[0]} is not widened to ':root, [data-density="comfortable"]'. Run scripts/widen-semantic-scope.mjs before bundling (or use the generate:css-bundle package script, which chains it)`,
  )

const seenFamilies = new Set()
const withFallback = contents.map(([, css]) =>
  css.replace(FAMILY_DECLARATION, (declaration, name, value) => {
    seenFamilies.add(name)
    const stack = value.trim()
    return GENERIC_FAMILIES.has(lastFamily(stack))
      ? declaration
      : `${name}: ${stack}, ${FONT_FALLBACK};`
  }),
)

const missingFamilies = REQUIRED_FAMILY_NAMES.filter(
  (name) => !seenFamilies.has(name),
)
if (missingFamilies.length > 0)
  fail(
    `no ${missingFamilies.join(' or ')} declaration under ${CSS_DIR}, so the font tokens were renamed or moved. Review #5701 before proceeding: the bundle would ship a bare typeface name, and text falls back to the browser's serif wherever the font is not loaded`,
  )

const concatenated = withFallback.join('\n')

// The export's last file ends without a trailing newline, so the
// layer's closing brace needs one of its own to land on its own line
const body = concatenated.endsWith('\n') ? concatenated : `${concatenated}\n`

await writeFile(
  OUT_FILE,
  HEADER + LAYER_ORDER + LAYER_OPEN + body + LAYER_CLOSE,
)

// Regression guard reused from the 2.x build: the bundle must contain no
// light-dark() literals or lightningcss polyfill markers, and both
// color-scheme scopes must be present (the new export has exactly one
// block per scheme, hence the threshold of 1)
execFileSync(
  process.execPath,
  [
    fileURLToPath(new URL('assert-no-light-dark.mjs', import.meta.url)),
    OUT_FILE,
    '1',
  ],
  { stdio: 'inherit' },
)

console.log(
  `generate-css-bundle: wrote ${OUT_FILE} from ${files.length} files (${files
    .map((file) => relative(CSS_DIR, file))
    .join(', ')})`,
)

/**
 * The last comma-separated part of a value, at nesting depth 0, which
 * is the generic family of a font stack when it has one. Depth matters
 * because a `var()` fallback arm carries commas of its own.
 */
function lastFamily(value) {
  let depth = 0
  let start = 0
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if (character === '(') depth += 1
    else if (character === ')') depth -= 1
    else if (character === ',' && depth === 0) start = index + 1
  }
  return value
    .slice(start)
    .trim()
    .replace(/^["']|["']$/g, '')
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
  console.error(`generate-css-bundle: ${message}`)
  process.exit(1)
}
