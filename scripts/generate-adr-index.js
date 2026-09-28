#!/usr/bin/env node

/**
 * Generates documentation/adr/README.md, an index of every ADR with its
 * title, status and decision date, so readers can find the relevant decision
 * without opening twenty files named by number.
 *
 * Source of truth: the ADR files themselves (documentation/adr/NNNN-*.md).
 * Title comes from the first `# ` heading, status and date from the
 * `- **Status:**` / `- **Date:**` lines defined by 0000-template.md.
 *
 * Re-run via `pnpm run generate:adr-index`. Also runs as part of `prebuild`,
 * so a root `pnpm run build` keeps the file fresh.
 *
 * `--check` regenerates in memory and exits 1 if the committed file is stale.
 *
 * Duplicate ADR numbers exit 1 in every mode, not just `--check`. Two files
 * claiming one number defeats the only thing the numbering provides, which is
 * a unique handle to cite. This happened three times before 2026-09-18.
 */

const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const adrDir = path.join(rootDir, 'documentation/adr')
const outputPath = path.join(adrDir, 'README.md')

const TEMPLATE = '0000-template.md'

// The statuses 0000-template.md offers. Anything else is drift worth naming.
const TEMPLATE_STATUSES = [
  'Proposed',
  'Accepted',
  'Rejected',
  'Deprecated',
  'Superseded',
]

// Longest note kept in the table. Beyond this the row stops being scannable.
const NOTE_MAX = 90

/**
 * Reads a `- **Label:** value` field, including any indented continuation
 * lines. ADR 0010's status wraps onto a second line, and reading only the
 * first would cut its acceptance date off mid-sentence.
 */
const fieldValue = (body, label) => {
  const lines = body.split('\n')
  const labelPattern = new RegExp(`^-\\s*\\*\\*${label}:\\*\\*`)
  const start = lines.findIndex((line) => labelPattern.test(line))

  if (start === -1) return null

  const parts = [lines[start].replace(labelPattern, '')]

  // A continuation line is indented. The next field starts at column 0, so
  // it ends the value.
  for (let i = start + 1; i < lines.length; i += 1) {
    if (!/^\s+\S/.test(lines[i])) break
    parts.push(lines[i].trim())
  }

  return parts.join(' ').trim() || null
}

// Cuts on a word boundary so the note doesn't end mid-word.
const truncate = (text) => {
  if (text.length <= NOTE_MAX) return text
  const cut = text.slice(0, NOTE_MAX - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

const parseAdr = (filename) => {
  const body = fs.readFileSync(path.join(adrDir, filename), 'utf8')

  const number = filename.slice(0, 4)
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const rawStatus = fieldValue(body, 'Status')
  const rawDate = fieldValue(body, 'Date')

  // Statuses carry trailing detail ("Accepted (superseded by ADR 0006)"), so
  // keep the keyword for the column and the detail for the note. Matching is
  // deliberately case-insensitive and normalises to the template's casing:
  // `accepted` is the same decision as `Accepted`, so it is not drift. A word
  // outside the template survives as written and is reported below.
  const statusKeyword = rawStatus
    ? TEMPLATE_STATUSES.find((s) =>
        new RegExp(`^${s}\\b`, 'i').test(rawStatus),
      ) || rawStatus.split(/[\s(]/)[0]
    : null

  const note =
    rawStatus && statusKeyword
      ? rawStatus
          .slice(statusKeyword.length)
          // Keep link text, drop the target, so "superseded by ADR 0006" fits.
          .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
          .replace(/^[\s(]+|[\s)]+$/g, '')
      : ''

  // Dates range from "2026-03-20" to "2025-06 (recorded retrospectively...)".
  const dateMatch = rawDate ? rawDate.match(/\d{4}(?:-\d{2}){0,2}/) : null

  return {
    filename,
    number,
    title: titleMatch ? titleMatch[1].trim() : '(no title heading)',
    status: statusKeyword || 'not recorded',
    offTemplateStatus: Boolean(
      statusKeyword && !TEMPLATE_STATUSES.includes(statusKeyword),
    ),
    // Truncated rather than dropped: the opening clause usually carries the
    // part worth reading, such as the date a proposal was actually accepted.
    note: truncate(note),
    date: dateMatch ? dateMatch[0] : 'not recorded',
  }
}

const adrs = fs
  .readdirSync(adrDir)
  .filter((f) => /^\d{4}-.+\.md$/.test(f) && f !== TEMPLATE)
  .sort()
  .map(parseAdr)

const duplicates = Object.entries(
  adrs.reduce((acc, adr) => {
    acc[adr.number] = (acc[adr.number] || []).concat(adr.filename)
    return acc
  }, {}),
).filter(([, files]) => files.length > 1)

if (duplicates.length > 0) {
  console.error('Duplicate ADR numbers found:\n')
  duplicates.forEach(([number, files]) => {
    console.error(`  ${number}: ${files.join(', ')}`)
  })
  console.error(
    '\nAn ADR number must be unique so it can be cited unambiguously.',
  )
  console.error(
    'Move one of them to the next free number and update every reference',
  )
  console.error('to it. Convention is that the file which claimed the number')
  console.error(
    'first keeps it, which `git log --diff-filter=A` will tell you.',
  )
  process.exit(1)
}

// Backslashes are escaped first. Otherwise a title containing one before a
// pipe would emit a real cell break and shift the rest of the row.
const escapeCell = (text) => text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|')

const rows = adrs.map((adr) => {
  const link = `[${adr.number}](./${adr.filename})`
  return `| ${link} | ${escapeCell(adr.title)} | ${adr.status} | ${adr.date} | ${escapeCell(adr.note)} |`
})

const offTemplate = adrs.filter((adr) => adr.offTemplateStatus)

const content = `<!-- AUTOGENERATED by scripts/generate-adr-index.js. Do not edit by hand. -->
<!-- Re-run: pnpm run generate:adr-index -->

# Architecture Decision Records

This directory records the decisions behind non-obvious parts of EDS, so that
settled questions are not re-litigated and a future maintainer or code agent
has something to check a change against. Read the relevant record before
changing or extending the pattern it describes.

Write new records from [\`0000-template.md\`](./0000-template.md), taking the
next free number. The number is a permanent handle for citation, so it reflects
the order records were written rather than the order decisions were made. A
record whose context has changed should be superseded rather than rewritten,
keeping the original reasoning readable and dated.

Records: ${adrs.length}

| ADR | Title | Status | Date | Note |
| --- | ----- | ------ | ---- | ---- |
${rows.join('\n')}
${
  offTemplate.length > 0
    ? `
## Statuses outside the template

${offTemplate
  .map(
    (adr) =>
      `- [\`${adr.filename}\`](./${adr.filename}) uses \`${adr.status}\`.`,
  )
  .join('\n')}

The template offers ${TEMPLATE_STATUSES.join(', ')}. These records use
something else, which is worth settling so the column can be relied on.
`
    : ''
}`

const isCheck = process.argv.includes('--check')
const existing = fs.existsSync(outputPath)
  ? fs.readFileSync(outputPath, 'utf8')
  : null

if (isCheck) {
  if (existing !== content) {
    console.error(
      'documentation/adr/README.md is stale. Run `pnpm run generate:adr-index`.',
    )
    process.exit(1)
  }
  console.log(`ADR index is up to date (${adrs.length} records).`)
} else {
  fs.writeFileSync(outputPath, content)
  console.log(
    `Wrote documentation/adr/README.md (${adrs.length} records, no duplicate numbers).`,
  )
}
