/**
 * build-semantic-schema.mts
 *
 * Reads the Figma semantic-colour export (default.tokens.json) and regenerates
 * tokens-project/sets/semantic.json as REFERENCES into our scheme layer.
 *
 * Mapping (colour family + step -> mode-free scheme role, step preserved):
 *   Light/Gray/N, Neutral/N -> {neutral.N}
 *   Light/Moss Green/N       -> {accent.N}
 *   Light/Blue/N             -> {info.N}
 *   Orange/N                 -> {warning.N}
 *   (Red -> danger, Green -> success — none appear in this export, kept for safety)
 *
 * Rules:
 *   - Never emit raw hex EXCEPT the two sanctioned no-reference tokens
 *     (border.focus, overlay.scrim), which keep their intentional values.
 *   - Skip the #000000 status placeholders that carry no target.
 *   - Sanitize names: spaces -> hyphens (API rejects spaces/braces/brackets).
 *
 * See tsctl/POC-alex-color-import.md and the approved plan.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const INPUT = join(HERE, 'default.tokens.json')
const OUTPUT = join(HERE, 'tokens-project', 'sets', 'semantic.json')

// Figma colour family -> scheme role
const FAMILY_TO_ROLE: Record<string, string> = {
  gray: 'neutral',
  neutral: 'neutral',
  'moss green': 'accent',
  blue: 'info',
  orange: 'warning',
  red: 'danger',
  green: 'success',
}

// Sanctioned raw tokens (no aliasData, intentional values). Keyed by sanitized name.
const RAW_OVERRIDES: Record<string, string> = {
  'border.focus': '#5e9ed6',
  'overlay.scrim': 'rgba(29, 29, 29, 0.1)',
}

const sanitize = (name: string) => name.replace(/\s+/g, '-')

/** "Light/Moss Green/14" | "Orange/11" | "Neutral/4" -> "{accent.14}" (or null). */
function aliasToRef(targetVariableName: string): string | null {
  const parts = targetVariableName.split('/').map((p) => p.trim())
  const step = parts[parts.length - 1]
  let familyParts = parts.slice(0, -1)
  if (familyParts[0]?.toLowerCase() === 'light' || familyParts[0]?.toLowerCase() === 'dark') {
    familyParts = familyParts.slice(1)
  }
  const family = familyParts.join(' ').toLowerCase()
  const role = FAMILY_TO_ROLE[family]
  if (!role || !/^\d+$/.test(step)) return null
  return `{${role}.${step}}`
}

type Leaf = { $type: string; $value: unknown; $extensions?: any }
const isLeaf = (n: any): n is Leaf =>
  n && typeof n === 'object' && '$type' in n && '$value' in n

const out: Record<string, { $type: string; $value: string; $description: null }> = {}
const skipped: string[] = []
const raw: string[] = []

function walk(node: any, path: string[]): void {
  if (isLeaf(node)) {
    const name = sanitize(path.join('.'))
    const alias = node.$extensions?.['com.figma.aliasData']?.targetVariableName as
      | string
      | undefined

    if (alias) {
      const ref = aliasToRef(alias)
      if (!ref) {
        throw new Error(`Unmapped alias "${alias}" at ${name}`)
      }
      out[name] = { $type: 'color', $value: ref, $description: null }
      return
    }

    // No aliasData: only the two sanctioned raw tokens survive; the rest are skipped.
    if (name in RAW_OVERRIDES) {
      out[name] = { $type: 'color', $value: RAW_OVERRIDES[name], $description: null }
      raw.push(name)
    } else {
      skipped.push(name)
    }
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue // skip $extensions / $type sidecars
      walk(v, [...path, k])
    }
  }
}

const input = JSON.parse(readFileSync(INPUT, 'utf8'))
walk(input, [])

// Deterministic key order for a clean diff.
const ordered: typeof out = {}
for (const k of Object.keys(out).sort()) ordered[k] = out[k]

const doc = { $set: 'semantic', tokens: ordered }
writeFileSync(OUTPUT, JSON.stringify(doc, null, 2) + '\n', 'utf8')

console.log(`Wrote ${Object.keys(ordered).length} tokens to ${OUTPUT}`)
console.log(`  raw (kept):   ${raw.length} -> ${raw.join(', ')}`)
console.log(`  skipped (no target): ${skipped.length} -> ${skipped.join(', ')}`)
