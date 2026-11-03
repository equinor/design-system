import type { Token, TokenHints } from './tokens.js'
import type { Component, ComponentData, Guidance, PropList } from './types.js'

/**
 * Plain-text output. It is kept short because an agent pays for every line it
 * reads: `show` prints three examples unless asked for all of them, and
 * nothing is decorated. Results end with the command to run next (`→ ...`),
 * so an agent follows up instead of guessing or rereading the help.
 */

export const SECTIONS = [
  'props',
  'examples',
  'features',
  'usage',
  'accessibility',
  'related',
  'links',
] as const
export type Section = (typeof SECTIONS)[number]

const GUIDANCE: [keyof Guidance, string][] = [
  ['features', 'Features'],
  ['usage', 'Usage'],
  ['accessibility', 'Accessibility'],
  ['related', 'Related components'],
]

const EXAMPLES_BY_DEFAULT = 3

const indent = (text: string, by = '  ') =>
  text
    .split('\n')
    .map((line) => (line ? by + line : line))
    .join('\n')

// The first sentence, across line breaks, without stopping at "e.g." or "i.e.".
const firstSentence = (text: string | null) => {
  if (!text) return ''
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.match(/^.*?(?<!\b(?:e\.g|i\.e))[.!?](?=\s|$)/)?.[0] ?? flat
}

function componentLines(components: Component[]): string[] {
  const width = Math.max(...components.map((c) => c.name.length))
  return components.map((c) => {
    const status = c.status === 'deprecated' ? ' (deprecated)' : ''
    const kind = c.kind === 'utility' ? ' (utility)' : ''
    return `${c.name.padEnd(width)}  ${firstSentence(c.description)}${kind}${status}`.trimEnd()
  })
}

export function formatList(data: ComponentData): string {
  return [
    ...componentLines(data.components),
    '',
    `${data.components.length} components. Run \`eds show <Component>\` for the import, props and examples.`,
  ].join('\n')
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export function formatSearch(
  query: string,
  matches: Component[],
  similar: string[] = [],
): string {
  if (matches.length === 0) {
    const hint = similar.length
      ? ` Did you mean ${similar.join(', ')}?\n→ eds show ${similar[0]}`
      : ' Run `eds list` to see them all.'
    return `No component matches "${query}".${hint}`
  }
  const lines = matches.map((c) => {
    const counts = `(${plural(c.props.length, 'prop')}, ${plural(c.examples.length, 'example')})`
    const status = [
      c.kind === 'utility' ? ' utility' : '',
      c.status === 'deprecated' ? ' deprecated' : '',
    ].join('')
    const description = firstSentence(c.description)
    return [
      `${c.name} ${counts}${status}`,
      ...(description ? [`  ${description}`] : []),
      `  → eds show ${c.name}`,
    ].join('\n')
  })
  // Only matches on the name are ranked. The others are in alphabetical order,
  // so the first three of them are not a recommendation (`eds search form`
  // would suggest Input, which says to use TextField).
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const byName = matches.filter((c) =>
    words.some((w) => c.name.toLowerCase().includes(w)),
  )
  if (byName.length > 1) {
    lines.push(
      `→ Several at once: eds show ${byName
        .slice(0, 3)
        .map((c) => c.name)
        .join(' ')}`,
    )
  }
  return lines.join('\n')
}

function formatProps(component: Component): string[] {
  const lines = [
    'Props',
    ...formatGeneric(component),
    ...formatPropList(component),
  ]
  for (const sub of component.subComponents) {
    lines.push('', `${sub.name} props`, ...formatPropList(sub))
  }
  for (const hook of component.hooks ?? []) {
    lines.push('', `Hook ${hook.signature}`, `  ${hook.description}`)
    lines.push(`  ${hook.importLine}`)
    for (const field of hook.returns) {
      lines.push(`  ${field.name}: ${field.type}`)
      if (field.description) lines.push(`    ${field.description}`)
    }
  }
  return lines
}

// A generic component takes the agent's own type in the props that name the
// type parameter, such as `options: T[]` in Autocomplete.
function formatGeneric(component: Component): string[] {
  return (component.typeParameters ?? []).map((parameter) => {
    const name = parameter.split(/[\s=]/)[0]
    const uses = component.props
      .filter((prop) => new RegExp(`\\b${name}\\b`).test(prop.type))
      .map((prop) => prop.name)
    const where = uses.length ? ` in ${uses.join(', ')}` : ''
    return `  Generic over ${parameter}: pass your own type${where}.`
  })
}

function formatPropList({ props, baseTypes }: PropList): string[] {
  const lines: string[] = []
  if (props.length === 0) lines.push('  No props of its own.')
  for (const prop of props) {
    const optional = prop.optional ? '?' : ''
    const fallback = prop.default ? ` = ${prop.default}` : ''
    lines.push(`  ${prop.name}${optional}: ${prop.type}${fallback}`)
    if (prop.description) lines.push(`    ${prop.description}`)
  }
  for (const base of baseTypes) {
    const except = base.omitted.length
      ? `, except ${base.omitted.join(', ')}`
      : ''
    lines.push(`  Also accepts the props of ${base.name}${except}.`)
  }
  return lines
}

function formatExamples(component: Component, all: boolean): string[] {
  if (component.examples.length === 0) return []
  const shown = all
    ? component.examples
    : component.examples.slice(0, EXAMPLES_BY_DEFAULT)
  const lines = ['Examples']
  for (const example of shown) {
    // A caption can run over several lines, or hold a table.
    const [first, ...more] = (example.caption ?? '').split('\n')
    lines.push(`  ${example.title}${first ? `: ${first}` : ''}`)
    if (more.length) lines.push(indent(more.join('\n'), '    '))
    lines.push(indent(example.code, '    '))
  }
  const hidden = component.examples.length - shown.length
  if (hidden > 0) {
    lines.push(
      `  ${hidden} more: \`eds show ${component.name} --section examples\``,
    )
  }
  return lines
}

function formatGuidance(component: Component, only?: keyof Guidance): string[] {
  const lines: string[] = []
  for (const [key, heading] of GUIDANCE) {
    const text = component.guidance[key]
    if (!text || (only && key !== only)) continue
    lines.push(heading, indent(text), '')
  }
  return lines
}

function formatLinks(component: Component): string[] {
  const links = Object.entries(component.links).filter(([, url]) => url)
  if (links.length === 0) return []
  return ['Links', ...links.map(([kind, url]) => `  ${kind}: ${url}`)]
}

/**
 * Several components, separated by a rule. With one section, each part starts
 * with the component name, so the answers can be told apart. The hint about
 * tokens comes once, at the end.
 */
export function formatComponents(
  components: Component[],
  section?: Section,
): string {
  const parts = components.map((component) => {
    const text = formatComponent(component, section)
    return section && components.length > 1
      ? `${component.name}\n\n${text}`
      : text
  })
  const hint = section
    ? []
    : [
        '→ Tokens for the layout around it: eds tokens <words>, such as eds tokens spacing',
      ]
  return [parts.join('\n\n---\n\n'), ...hint].join('\n\n')
}

export function formatComponent(
  component: Component,
  section?: Section,
): string {
  const blocks: string[][] = []
  if (!section) {
    const header = [component.name]
    if (component.status === 'deprecated') header.push('Deprecated.')
    if (component.kind === 'utility') {
      header.push('A utility for building components, not a UI component.')
    }
    if (component.description) header.push(component.description)
    header.push('', component.importLine)
    if (component.hasAsChild) {
      header.push(
        'Supports asChild: pass one child element to render it with the component styles.',
      )
    }
    if (component.subComponents.length) {
      header.push(
        `Sub-components: ${component.subComponents.map((sub) => sub.name).join(', ')}`,
      )
    }
    blocks.push(header)
  }
  if (!section) {
    blocks.push(
      formatProps(component),
      formatExamples(component, false),
      formatGuidance(component),
      formatLinks(component),
    )
  } else {
    // One section is what the agent asked for, so say so when it is empty
    // instead of printing nothing.
    const lines =
      section === 'props'
        ? formatProps(component)
        : section === 'examples'
          ? formatExamples(component, true)
          : section === 'links'
            ? formatLinks(component)
            : formatGuidance(component, section)
    const empty =
      section === 'examples' || section === 'links'
        ? `${component.name} has no ${section} yet.`
        : `${component.name} has no ${section} guidance yet.`
    blocks.push(lines.length ? lines : [empty])
  }

  return blocks
    .filter((b) => b.length)
    .map((b) => b.join('\n').trimEnd())
    .join('\n\n')
}

function formatNoTokens(query: string, hints: TokenHints): string {
  const lines = [`No token matches "${query}".`]
  for (const { word, use } of hints.renamed) {
    lines.push(`Tokens do not use "${word}": try ${use}.`)
  }
  lines.push(
    `Semantic token names start with: ${hints.groups.join(', ')}.`,
    'Use fewer words, such as `eds tokens spacing` or `eds tokens background accent`.',
  )
  return lines.join('\n')
}

export function formatTokens(
  tokens: Token[],
  {
    scheme,
    density,
    query,
    hints,
    all,
  }: {
    scheme: string
    density: string
    query: string
    hints: TokenHints
    all: boolean
  },
): string {
  if (tokens.length === 0) return formatNoTokens(query, hints)
  const width = Math.max(...tokens.map((t) => t.name.length))
  return [
    ...tokens.map((t) => {
      // The reference names an internal token, such as --eds-density-*, which
      // component CSS must not use, so it only shows with --all.
      const via = all && t.value !== t.resolved ? `  (${t.value})` : ''
      return `${t.name.padEnd(width)}  ${t.resolved}${via}`
    }),
    '',
    `${plural(tokens.length, 'token')}, values for ${scheme} colour scheme and ${density} density. Use them as var(<name>).`,
    `→ The values follow data-color-scheme="${scheme}" and data-density="${density}" on an ancestor element.`,
    // Typography tokens give the size and line height. The family and weight
    // are separate tokens, and a heading without them renders in the UI font.
    ...(tokens.some((t) => t.name.includes('-typography-'))
      ? ['→ Family and weight: eds tokens font']
      : []),
  ].join('\n')
}
