const fs = require('fs')
const { OPTIONAL_SIDECAR_SECTIONS, SIDECAR_METADATA_KEYS } = require('./config')
const { fail } = require('./errors')

// Reads {Component}.docs.md: the hand-written part of the page. An optional
// metadata block at the top (`aria`, `docs`) feeds the Links row. The rest is
// split at its `## ` headings, and the required and optional sections are fixed.
// Returns { sections, links }.
function readSidecar(file, cfg) {
  if (!fs.existsSync(file)) fail(`missing hand-written sidecar: ${file}`)
  const text = fs.readFileSync(file, 'utf8')
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)
  const links = parseMetadata(file, frontmatter?.[1])
  // HTML comments are notes to the author and never reach the page.
  const body = (frontmatter ? text.slice(frontmatter[0].length) : text).replace(
    /<!--[\s\S]*?-->/g,
    '',
  )

  const parts = body.split(/^## (.+)$/m)
  const sections = {}
  for (let i = 1; i < parts.length; i += 2) {
    sections[parts[i].trim()] = parts[i + 1].trim()
  }
  if (sections.Summary && !cfg.requiredSections.includes('Summary')) {
    fail(
      `${file}: remove the Summary. It is written once, in the web sidecar, and shown above both tabs.`,
    )
  }
  const missing = cfg.requiredSections.filter((s) => !sections[s])
  const allowed = [...cfg.requiredSections, ...OPTIONAL_SIDECAR_SECTIONS]
  const extra = Object.keys(sections).filter((s) => !allowed.includes(s))
  if (missing.length || extra.length) {
    fail(
      `${file}: sections must be ${cfg.requiredSections.join(', ')}, plus optionally ${OPTIONAL_SIDECAR_SECTIONS.join(', ')} ` +
        `(missing: ${missing.join(', ') || 'none'}, unexpected: ${extra.join(', ') || 'none'})`,
    )
  }
  return { sections, links }
}

// The metadata block: `aria: <W3C URL>` and `docs: <docs-site page>` lines.
function parseMetadata(file, block) {
  const meta = {}
  for (const line of (block ?? '').split('\n')) {
    if (!line.trim()) continue
    const match = line.match(/^(\w+):\s*(\S+)\s*$/)
    if (!match || !SIDECAR_METADATA_KEYS.includes(match[1])) {
      fail(
        `${file}: metadata line "${line}" is not one of ${SIDECAR_METADATA_KEYS.map((k) => `${k}: <value>`).join(', ')}`,
      )
    }
    meta[match[1]] = match[2]
  }
  if (meta.aria && !meta.aria.startsWith('https://www.w3.org/')) {
    fail(`${file}: aria must be a https://www.w3.org/ URL, got ${meta.aria}`)
  }
  return meta
}

// The code inside the first ```tsx block of a sidecar section.
const fencedCode = (md) =>
  md.match(/```tsx\n([\s\S]*?)\n```/)?.[1] ??
  fail('sidecar Usage needs a ```tsx block')

module.exports = { readSidecar, fencedCode }
