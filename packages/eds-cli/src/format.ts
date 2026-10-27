import type { Token } from './tokens.js'
import type { Component, ComponentData, Guidance } from './types.js'

/**
 * Plain-text output. It is kept short because an agent pays for every line it
 * reads: `show` prints three examples unless asked for all of them, and
 * nothing is decorated.
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

const firstSentence = (text: string | null) =>
  text ? (text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text) : ''

function componentLines(components: Component[]): string[] {
  const width = Math.max(...components.map((c) => c.name.length))
  return components.map((c) => {
    const status = c.status === 'deprecated' ? ' (deprecated)' : ''
    return `${c.name.padEnd(width)}  ${firstSentence(c.description)}${status}`.trimEnd()
  })
}

export function formatList(data: ComponentData): string {
  return [
    ...componentLines(data.components),
    '',
    `${data.components.length} components. Run \`eds show <Component>\` for the import, props and examples.`,
  ].join('\n')
}

export function formatSearch(query: string, matches: Component[]): string {
  if (matches.length === 0) {
    return `No component matches "${query}". Run \`eds list\` to see them all.`
  }
  return componentLines(matches).join('\n')
}

function formatProps(component: Component): string[] {
  const lines = ['Props']
  if (component.props.length === 0) lines.push('  No props of its own.')
  for (const prop of component.props) {
    const optional = prop.optional ? '?' : ''
    const fallback = prop.default ? ` = ${prop.default}` : ''
    lines.push(`  ${prop.name}${optional}: ${prop.type}${fallback}`)
    if (prop.description) lines.push(`    ${prop.description}`)
  }
  for (const base of component.baseTypes) {
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
    lines.push(
      `  ${example.title}${example.caption ? `: ${example.caption}` : ''}`,
    )
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

export function formatComponent(
  component: Component,
  section?: Section,
): string {
  const blocks: string[][] = []
  if (!section) {
    const header = [component.name]
    if (component.status === 'deprecated') header.push('Deprecated.')
    if (component.description) header.push(component.description)
    header.push('', component.importLine)
    if (component.hasAsChild) {
      header.push(
        'Supports asChild: pass one child element to render it with the component styles.',
      )
    }
    if (component.subComponents.length) {
      header.push(`Sub-components: ${component.subComponents.join(', ')}`)
    }
    blocks.push(header)
  }
  if (!section || section === 'props') blocks.push(formatProps(component))
  if (!section || section === 'examples') {
    blocks.push(formatExamples(component, section === 'examples'))
  }
  if (!section) blocks.push(formatGuidance(component))
  else if (
    section !== 'props' &&
    section !== 'examples' &&
    section !== 'links'
  ) {
    const lines = formatGuidance(component, section)
    blocks.push(
      lines.length
        ? lines
        : [`${component.name} has no ${section} guidance yet.`],
    )
  }
  if (!section || section === 'links') blocks.push(formatLinks(component))

  return blocks
    .filter((b) => b.length)
    .map((b) => b.join('\n').trimEnd())
    .join('\n\n')
}

export function formatTokens(
  tokens: Token[],
  { scheme, density }: { scheme: string; density: string },
): string {
  if (tokens.length === 0) {
    return 'No token matches. Try fewer words, such as `eds tokens background accent`.'
  }
  const width = Math.max(...tokens.map((t) => t.name.length))
  return [
    ...tokens.map((t) => {
      const via = t.value !== t.resolved ? `  (${t.value})` : ''
      return `${t.name.padEnd(width)}  ${t.resolved}${via}`
    }),
    '',
    `${tokens.length} tokens, values for ${scheme} colour scheme and ${density} density. Use them as var(<name>).`,
  ].join('\n')
}
