/**
 * Check that every `var()` in the Tokens Studio CSS export points at a
 * custom property the export declares, and that no chain of references
 * loops back on itself.
 *
 * The TypeScript modules used to be built by a script that resolved every
 * `var()` chain across these files, so a reference to a name nobody
 * declares (`CSS variable not found`) or a cycle (`circular var() chain`)
 * stopped the release by accident. The modules now come from the
 * platform's TypeScript export, which does not read these files, so the
 * check lives here. Neither case is caught by `assert-no-duplicate-names`
 * (#5407), which looks at declarations, not at what they reference.
 *
 * A name is declared when any file declares it, in any scope. A cycle is
 * a loop in the graph of those declarations. A `var()` with a fallback
 * (`var(--x, 1px)`) is not an error when the name is missing. The
 * committed `variables.css` bundle repeats every declaration, so it is
 * skipped.
 *
 * Usage: node scripts/assert-css-references.mjs [--css <dir>]
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import process from 'node:process'

const BUNDLE = 'variables.css'

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '')
    if (!key || argv[i + 1] === undefined) fail(`missing value for ${argv[i]}`)
    out[key] = argv[i + 1]
  }
  return out
}

function fail(message) {
  console.error(`assert-css-references: ${message}`)
  process.exit(1)
}

const CSS_DIR = parseArgs(process.argv.slice(2)).css ?? 'src/tokens/css'

async function listCss(dir) {
  const found = []
  const walk = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) await walk(full)
      else if (entry.name.endsWith('.css') && entry.name !== BUNDLE)
        found.push(full)
    }
  }
  await walk(dir)
  return found.sort()
}

const files = await listCss(CSS_DIR)
if (files.length === 0) fail(`no CSS files found in ${CSS_DIR}`)

/** @type {Map<string, Set<string>>} name -> names it references without a fallback */
const declared = new Map()
/** @type {Array<[file: string, name: string, reference: string]>} */
const references = []

const DECLARATION = /(--[\w-]+)\s*:\s*([^;{}]+);/g
const VAR = /var\(\s*(--[\w-]+)\s*(,)?/g

for (const file of files) {
  const css = (await readFile(file, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '')
  for (const [, name, value] of css.matchAll(DECLARATION)) {
    if (!declared.has(name)) declared.set(name, new Set())
    for (const [, reference, fallback] of value.matchAll(VAR)) {
      if (fallback) continue
      declared.get(name).add(reference)
      references.push([relative(CSS_DIR, file), name, reference])
    }
  }
}

const problems = []

for (const [file, name, reference] of references)
  if (!declared.has(reference))
    problems.push(
      `${file}: ${name} references ${reference}, which is never declared`,
    )

// A loop in the reference graph resolves to nothing
const state = new Map() // name -> 'visiting' | 'done'
const stack = []
const cycles = new Set()
function visit(name) {
  if (state.get(name) === 'done') return
  if (state.get(name) === 'visiting') {
    const loop = [...stack.slice(stack.indexOf(name)), name]
    cycles.add(loop.join(' -> '))
    return
  }
  state.set(name, 'visiting')
  stack.push(name)
  for (const next of declared.get(name) ?? []) visit(next)
  stack.pop()
  state.set(name, 'done')
}
for (const name of declared.keys()) visit(name)
for (const loop of cycles) problems.push(`circular reference: ${loop}`)

if (problems.length > 0) {
  console.error(
    `assert-css-references: ${problems.length} problem(s) in ${CSS_DIR}`,
  )
  for (const problem of [...new Set(problems)]) console.error(`  ${problem}`)
  process.exit(1)
}

console.log(
  `assert-css-references: ${declared.size} custom properties in ${files.length} file(s), every reference resolves and none loops`,
)
