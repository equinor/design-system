/**
 * Remove the internal `foundation` and `input` token sets from the
 * Tokens Studio CSS and DTCG exports (#5657).
 *
 * The two sets are the maths Tokens Studio uses to calculate the colour
 * palette (anchor hue/chroma, the scale inputs and the Gaussian
 * weights). Consumers use the semantic tokens, and no published token
 * references the sets: the colours arrive already evaluated. The sets
 * have to stay `Enabled` in Studio (#5551), and the platform cannot yet
 * leave an enabled set out of an export, so they land in every
 * colour-scheme file with identical values. This step strips them until
 * the export can exclude them itself.
 *
 * Runs after the exports and before generate-ts-tokens.mjs, so the TS
 * modules (built from DTCG structure + CSS values) and the bundle never
 * see the sets.
 *
 * - CSS: drops every `--eds-foundation-*` / `--eds-input-*` declaration,
 *   then fails if any `var()` still points at one, since that would
 *   resolve to nothing.
 * - DTCG: drops the top-level `foundation` / `input` groups as text,
 *   because a JSON round trip reorders numeric keys (`"1", "10", "2"`
 *   becomes `"1", "2", "10"`) and would rewrite every file. The result
 *   is parsed and compared against the expected tree before it is
 *   written, so a format the text edit does not understand fails the run
 *   instead of corrupting the file.
 *
 * Finding nothing to strip is a warning, not a failure: it means Studio
 * excluded the sets or one was renamed, and either way the export is
 * healthy and the release should still open its PR. Idempotent.
 *
 * Usage: node scripts/strip-internal-token-sets.mjs [--css <dir>] [--dtcg <dir>]
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { isDeepStrictEqual } from 'node:util'
import { join } from 'node:path'
import process from 'node:process'

const INTERNAL_SETS = ['foundation', 'input']

const args = parseArgs(process.argv.slice(2))
const CSS_DIR = args.css ?? 'src/tokens/css'
const DTCG_DIR = args.dtcg ?? 'src/tokens/dtcg'

const prefix = `--eds-(?:${INTERNAL_SETS.join('|')})-`
const DECLARATION_RE = new RegExp(`[ \\t]*${prefix}[\\w-]*\\s*:[^;]*;\\n?`, 'g')
const REFERENCE_RE = new RegExp(`var\\(\\s*${prefix}[\\w-]*`, 'g')
const TOP_LEVEL_GROUP_RE = new RegExp(
  `^  "(?:${INTERNAL_SETS.join('|')})": \\{$`,
)

let removedDeclarations = 0
let removedGroups = 0
const danglingReferences = []

for (const file of await listFiles(CSS_DIR, '.css')) {
  const css = await readFile(file, 'utf8')
  const stripped = css.replace(DECLARATION_RE, () => {
    removedDeclarations += 1
    return ''
  })
  for (const [reference] of stripped.matchAll(REFERENCE_RE))
    danglingReferences.push(`${file}: ${reference})`)
  if (stripped !== css) await writeFile(file, stripped)
}

if (danglingReferences.length > 0)
  fail(
    `${danglingReferences.length} reference(s) to a stripped token remain and would resolve to nothing:\n  ${danglingReferences.join('\n  ')}`,
  )

for (const file of await listFiles(DTCG_DIR, '.json')) {
  const text = await readFile(file, 'utf8')
  const tree = JSON.parse(text)
  const present = INTERNAL_SETS.filter((set) => Object.hasOwn(tree, set))
  if (present.length === 0) continue

  const stripped = removeTopLevelGroups(text)
  const expected = { ...tree }
  for (const set of present) delete expected[set]

  let actual
  try {
    actual = JSON.parse(stripped)
  } catch (error) {
    fail(`${file}: stripping left invalid JSON (${error.message})`)
  }
  if (!isDeepStrictEqual(actual, expected))
    fail(
      `${file}: could not strip ${present.join(', ')} — the export format changed, update removeTopLevelGroups`,
    )

  removedGroups += present.length
  await writeFile(file, stripped)
}

if (removedDeclarations === 0 && removedGroups === 0)
  console.warn(
    `strip-internal-token-sets: no ${INTERNAL_SETS.join(' or ')} tokens found — Tokens Studio may exclude them now, or a set was renamed. If they are gone for good, remove this step.`,
  )
else
  console.log(
    `strip-internal-token-sets: removed ${removedDeclarations} CSS declaration(s) and ${removedGroups} DTCG group(s)`,
  )

/**
 * Drop each internal top-level group from a 2-space-indented JSON
 * document, from its `  "name": {` line to the matching `  }` line. If
 * the group was the last key, the comma on the entry before it goes too.
 */
function removeTopLevelGroups(text) {
  const lines = text.split('\n')
  const kept = []
  for (let i = 0; i < lines.length; i += 1) {
    if (!TOP_LEVEL_GROUP_RE.test(lines[i])) {
      kept.push(lines[i])
      continue
    }
    let end = i + 1
    while (end < lines.length && !/^ {2}\},?$/.test(lines[end])) end += 1
    if (end === lines.length) return text
    if (!lines[end].endsWith(',') && kept.length > 0)
      kept[kept.length - 1] = kept[kept.length - 1].replace(/,$/, '')
    i = end
  }
  return kept.join('\n')
}

async function listFiles(dir, extension) {
  const entries = await readdir(dir, { recursive: true }).catch(() =>
    fail(`cannot read ${dir} — run the export (or pass a directory) first`),
  )
  return entries
    .filter((file) => file.endsWith(extension))
    .map((file) => join(dir, file))
    .sort()
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
  console.error(`strip-internal-token-sets: ${message}`)
  process.exit(1)
}
