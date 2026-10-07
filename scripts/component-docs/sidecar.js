const fs = require('fs')
const { SIDECAR_SECTIONS, OPTIONAL_SIDECAR_SECTIONS } = require('./config')
const { fail } = require('./errors')

// Reads {Component}.docs.md: the hand-written part of the page, split at its
// `## ` headings. Required and optional sections are fixed.
function readSidecar(file) {
  if (!fs.existsSync(file)) fail(`missing hand-written sidecar: ${file}`)
  const parts = fs.readFileSync(file, 'utf8').split(/^## (.+)$/m)
  const found = {}
  for (let i = 1; i < parts.length; i += 2) {
    found[parts[i].trim()] = parts[i + 1].trim()
  }
  const missing = SIDECAR_SECTIONS.filter((s) => !found[s])
  const allowed = [...SIDECAR_SECTIONS, ...OPTIONAL_SIDECAR_SECTIONS]
  const extra = Object.keys(found).filter((s) => !allowed.includes(s))
  if (missing.length || extra.length) {
    fail(
      `${file}: sections must be ${SIDECAR_SECTIONS.join(', ')}, plus optionally ${OPTIONAL_SIDECAR_SECTIONS.join(', ')} ` +
        `(missing: ${missing.join(', ') || 'none'}, unexpected: ${extra.join(', ') || 'none'})`,
    )
  }
  return found
}

// The optional Links section: `- ARIA: <url>` and `- Docs: <page>` lines.
function parseLinks(markdown) {
  const links = {}
  for (const line of (markdown ?? '').split('\n')) {
    const match = line.match(/^-\s+(ARIA|Docs):\s+(\S+)\s*$/)
    if (match) links[match[1]] = match[2]
    else if (line.trim()) fail(`Links section: unrecognised line "${line}"`)
  }
  if (links.ARIA && !links.ARIA.startsWith('https://www.w3.org/')) {
    fail(
      `Links section: ARIA must be a https://www.w3.org/ URL, got ${links.ARIA}`,
    )
  }
  return links
}

// The code inside the first ```tsx block of a sidecar section.
const fencedCode = (md) =>
  md.match(/```tsx\n([\s\S]*?)\n```/)?.[1] ??
  fail('sidecar Usage needs a ```tsx block')

module.exports = { readSidecar, parseLinks, fencedCode }
