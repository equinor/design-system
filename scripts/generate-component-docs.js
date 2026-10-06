#!/usr/bin/env node

/**
 * SPIKE: generates the Storybook docs page for one component on both
 * platforms from the same inputs.
 *
 *   node scripts/generate-component-docs.js Badge [--check]
 *
 * Inputs, per platform (web = eds-core-react /next, mobile = eds-mobile-components):
 *   {Component}.types.ts    props, types, defaults, descriptions (JSDoc)
 *   {Component}.stories.tsx example code and captions
 *   {Component}.docs.md     the hand-written part: Summary, Usage,
 *                           Accessibility, Related components
 *   {Component}.figma.tsx   Figma URL (web only, optional)
 *
 * Outputs:
 *   web:    next/{Component}/{Component}.docs.mdx  (attached MDX, both tabs)
 *   mobile: eds-mobile-components/docs/{Component}.mdx (plain markdown, the
 *           React Native tab)
 *
 * `--check` regenerates in memory and exits 1 if a committed file is stale,
 * the same contract as generate-component-index.js.
 */

const fs = require('fs')
const path = require('path')
const { Project, SyntaxKind, Node } = require('ts-morph')

const rootDir = path.resolve(__dirname, '..')

const BETA_CALLOUT =
  '**Beta:** safe to adopt alongside EDS 1.0. The API may still change in small ways before EDS 2.0 becomes stable. See [About EDS 2.0](?path=/docs/eds-2-0-beta-about--docs) for what beta means.'

const SIDECAR_SECTIONS = [
  'Summary',
  'Usage',
  'Accessibility',
  'Related components',
]

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

const PLATFORMS = {
  web: {
    dir: (c) => `packages/eds-core-react/src/components/next/${c}`,
    out: (c) =>
      `packages/eds-core-react/src/components/next/${c}/${c}.docs.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-core-react/next'`,
    installLine: 'npm install @equinor/eds-core-react@beta',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-core-react',
    sourceUrl: (c) =>
      `https://github.com/equinor/design-system/blob/main/packages/eds-core-react/src/components/next/${c}/${c}.tsx`,
    skipStories: new Set(['Introduction']),
  },
  mobile: {
    dir: (c) => `packages/eds-mobile-components/src/components/${c}`,
    out: (c) => `packages/eds-mobile-components/docs/${c}.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-mobile-components'`,
    installLine: 'npm install @equinor/eds-mobile-components',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-mobile-components',
    sourceUrl: (c) =>
      `https://github.com/equinor/design-system/blob/main/packages/eds-mobile-components/src/components/${c}/${c}.tsx`,
    skipStories: new Set(),
  },
}

const fail = (message) => {
  console.error(`generate-component-docs: ${message}`)
  process.exit(1)
}

const stripQuotes = (s) => s.replace(/^['"]|['"]$/g, '')

const humanise = (name) => {
  const words = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

const dedent = (text) => {
  const lines = text.split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
  )
  return lines.map((l) => l.slice(indent)).join('\n')
}

// One Figma component serves both platforms, so the web Code Connect file is
// the source for both pages.
function readFigmaUrl(component) {
  const web = PLATFORMS.web.dir(component)
  const file = path.join(rootDir, web, `${component}.figma.tsx`)
  if (!fs.existsSync(file)) return undefined
  return fs.readFileSync(file, 'utf8').match(/https:\/\/www\.figma\.com\/[^'"\s]+/)?.[0]
}

function readSidecar(file) {
  if (!fs.existsSync(file)) fail(`missing hand-written sidecar: ${file}`)
  const parts = fs.readFileSync(file, 'utf8').split(/^## (.+)$/m)
  const found = {}
  for (let i = 1; i < parts.length; i += 2) {
    found[parts[i].trim()] = parts[i + 1].trim()
  }
  const missing = SIDECAR_SECTIONS.filter((s) => !found[s])
  const extra = Object.keys(found).filter((s) => !SIDECAR_SECTIONS.includes(s))
  if (missing.length || extra.length) {
    fail(
      `${file}: sections must be exactly ${SIDECAR_SECTIONS.join(', ')} ` +
        `(missing: ${missing.join(', ') || 'none'}, unexpected: ${extra.join(', ') || 'none'})`,
    )
  }
  return found
}

// Props declared in the component's own types file. Props inherited from
// HTMLAttributes / ViewProps live in other files and are skipped.
function extractProps(project, file, component) {
  const sf = project.addSourceFileAtPath(file)
  const alias = sf.getTypeAliasOrThrow(`${component}Props`)
  const props = []
  for (const symbol of alias.getType().getProperties()) {
    const decl = symbol.getDeclarations()[0]
    if (!decl || decl.getSourceFile() !== sf || !Node.isPropertySignature(decl))
      continue

    const jsDoc = decl.getJsDocs()[0]
    const description = (jsDoc?.getDescription() ?? '')
      .trim()
      .replace(/\s+/g, ' ')
    const defaultTag = jsDoc?.getTags().find((t) => t.getTagName() === 'default')
    const typeNode = decl.getTypeNode()

    // Expand a reference to a local alias (e.g. BadgeTone) into its members.
    let resolved = typeNode
    const valueNotes = {}
    if (Node.isTypeReference(typeNode)) {
      const local = sf.getTypeAlias(typeNode.getTypeName().getText())
      if (local) {
        resolved = local.getTypeNode()
        // The alias JSDoc lists what each value means, as `- \`value\`: text`.
        const aliasDoc = local.getJsDocs()[0]?.getDescription() ?? ''
        for (const line of aliasDoc.split('\n')) {
          const note = line.match(/^\s*-\s+`([^`]+)`:\s*(.+)$/)
          if (note) valueNotes[note[1]] = note[2].trim()
        }
      }
    }
    const members = Node.isUnionTypeNode(resolved)
      ? resolved.getTypeNodes().map((n) => n.getText().replace(/"/g, "'"))
      : null
    const allLiterals =
      members && resolved.getTypeNodes().every((n) => Node.isLiteralTypeNode(n))

    props.push({
      name: symbol.getName(),
      optional: decl.hasQuestionToken(),
      type: members
        ? members.join(' | ')
        : typeNode.getText().replace(/\s+/g, ' '),
      literals: allLiterals ? members.map(stripQuotes) : null,
      valueNotes,
      default: defaultTag?.getCommentText()?.trim(),
      description,
    })
  }
  return props
}

function getStoryCaption(sf, declaration) {
  const name = declaration.getName()
  const init = declaration.getInitializer()
  let params
  if (Node.isObjectLiteralExpression(init)) {
    const p = init.getProperty('parameters')
    params = p && Node.isPropertyAssignment(p) ? p.getInitializer() : undefined
  }
  if (!params) {
    const assignment = sf
      .getDescendantsOfKind(SyntaxKind.BinaryExpression)
      .find((b) => b.getLeft().getText() === `${name}.parameters`)
    params = assignment?.getRight()
  }
  let cur = params
  for (const key of ['docs', 'description', 'story']) {
    if (!cur || !Node.isObjectLiteralExpression(cur)) return undefined
    const prop = cur.getProperty(key)
    cur = prop && Node.isPropertyAssignment(prop) ? prop.getInitializer() : null
  }
  return cur &&
    (Node.isStringLiteral(cur) || Node.isNoSubstitutionTemplateLiteral(cur))
    ? cur.getLiteralText()
    : undefined
}

function getStoryCode(sf, declaration) {
  let body = declaration.getInitializer()?.getBody?.()
  if (Node.isBlock(body)) {
    body = body.getFirstDescendantByKind(SyntaxKind.ReturnStatement)?.getExpression()
  }
  while (Node.isParenthesizedExpression(body)) body = body.getExpression()
  if (!body) return undefined
  if (Node.isJsxFragment(body)) {
    return dedent(
      sf
        .getFullText()
        .slice(
          body.getOpeningFragment().getEnd(),
          body.getClosingFragment().getStart(),
        ),
    )
  }
  const column = sf.getLineAndColumnAtPos(body.getStart()).column - 1
  return dedent(' '.repeat(column) + body.getText())
}

function extractStories(project, file, skip) {
  const sf = project.addSourceFileAtPath(file)
  const stories = []
  for (const statement of sf.getVariableStatements()) {
    if (!statement.isExported()) continue
    for (const declaration of statement.getDeclarations()) {
      const name = declaration.getName()
      if (skip.has(name)) continue
      stories.push({
        name,
        title: humanise(name),
        caption: getStoryCaption(sf, declaration),
        code: getStoryCode(sf, declaration),
      })
    }
  }
  return stories
}

// Turns a JSDoc value note ("Neutral gray tones (default)") into an inline
// aside ("neutral gray tones"). The default is stated separately.
function describeValue(note) {
  if (!note) return undefined
  const text = note.replace(/\s*\(default\)/, '').replace(/\.$/, '')
  return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text
}

function renderFeatures(props) {
  return props
    .map((p) => {
      if (p.literals) {
        const count = NUMBER_WORDS[p.literals.length] ?? p.literals.length
        const values = p.literals
          .map((l) => {
            const note = describeValue(p.valueNotes[l])
            return note ? `\`${l}\` (${note})` : `\`${l}\``
          })
          .join(', ')
        const fallback = p.default
          ? ` The default is \`${stripQuotes(p.default)}\`.`
          : ''
        return `- ${count} \`${p.name}\` values: ${values}.${fallback}`
      }
      if (p.name === 'children') return `- Accepts \`${p.type}\` as children.`
      return `- ${p.description}`
    })
    .join('\n')
}

function renderPropsTable(props) {
  const rows = props.map((p) => {
    const type = p.type.replace(/\|/g, '\\|')
    const description = p.optional ? p.description : `${p.description} Required.`
    return `| \`${p.name}\` | \`${type}\` | ${p.default ? `\`${p.default}\`` : 'None'} | ${description} |`
  })
  return ['| Prop | Type | Default | Description |', '|---|---|---|---|', ...rows].join('\n')
}

const fencedCode = (md) => md.match(/```tsx\n([\s\S]*?)\n```/)?.[1] ?? fail('sidecar Usage needs a ```tsx block')

function generatedNote(component, platform) {
  const dir = PLATFORMS[platform].dir(component)
  return `{/* Generated by scripts/generate-component-docs.js. Do not edit. Edit ${dir}/${component}.docs.md, ${component}.types.ts or ${component}.stories.tsx instead. */}`
}

function renderMobile(component, ctx) {
  const p = PLATFORMS.mobile
  const examples = ctx.stories
    .map(
      (s) =>
        `### ${s.title}\n\n${s.caption ? `${s.caption}\n\n` : ''}\`\`\`tsx\n${s.code}\n\`\`\``,
    )
    .join('\n\n')
  return `${generatedNote(component, 'mobile')}

${ctx.sidecar.Summary}

## Features

${renderFeatures(ctx.props)}

## Usage

\`\`\`bash
${p.installLine}
\`\`\`

\`\`\`tsx
${p.importLine(component)}

${fencedCode(ctx.sidecar.Usage)}
\`\`\`

## Props

${renderPropsTable(ctx.props)}

## Examples

${examples}

## Accessibility

${ctx.sidecar.Accessibility}

## Related components

${ctx.sidecar['Related components']}
`
}

function renderWeb(component, ctx) {
  const p = PLATFORMS.web
  const mobile = PLATFORMS.mobile
  const figma = ctx.figmaUrl ? `\n  figmaUrl="${ctx.figmaUrl}"` : ''
  const examples = ctx.stories
    .map(
      (s) =>
        `### ${s.title}\n\n${s.caption ? `${s.caption}\n\n` : ''}<Canvas of={Stories.${s.name}} />`,
    )
    .join('\n\n')
  return `${generatedNote(component, 'web')}

import { Meta, Primary, Controls, Canvas } from '@storybook/addon-docs/blocks'
import * as Stories from './${component}.stories'
import { Links, PlatformTabs } from './../../../../.storybook/components'
import MobileDocs from '@equinor/eds-mobile-components/docs/${component}.mdx'

<Meta of={Stories} />

# ${component}

${ctx.sidecar.Summary}

${BETA_CALLOUT}

<PlatformTabs mobile={<>
  <Links${figma}
    sourceUrl="${mobile.sourceUrl(component)}"
    npmUrl="${mobile.npmUrl}"
  />
  <MobileDocs />
</>}>

<Links${figma}
  sourceUrl="${p.sourceUrl(component)}"
  npmUrl="${p.npmUrl}"
/>

## Features

${renderFeatures(ctx.props)}

## Usage

\`\`\`bash
${p.installLine}
\`\`\`

\`\`\`tsx
${p.importLine(component)}

${fencedCode(ctx.sidecar.Usage)}
\`\`\`

## Props and playground

<Primary />
<Controls />

## Examples

${examples}

## Accessibility

${ctx.sidecar.Accessibility}

## Related components

${ctx.sidecar['Related components']}

</PlatformTabs>
`
}

function main() {
  const [component, ...flags] = process.argv.slice(2)
  if (!component) fail('usage: generate-component-docs.js <Component> [--check]')
  const check = flags.includes('--check')
  const project = new Project({ skipAddingFilesFromTsConfig: true })

  const results = []
  for (const [platform, cfg] of Object.entries(PLATFORMS)) {
    const dir = path.join(rootDir, cfg.dir(component))
    const ctx = {
      props: extractProps(project, path.join(dir, `${component}.types.ts`), component),
      stories: extractStories(
        project,
        path.join(dir, `${component}.stories.tsx`),
        cfg.skipStories,
      ),
      sidecar: readSidecar(path.join(dir, `${component}.docs.md`)),
      figmaUrl: readFigmaUrl(component),
    }
    const content =
      platform === 'web' ? renderWeb(component, ctx) : renderMobile(component, ctx)
    results.push({ file: path.join(rootDir, cfg.out(component)), content })
  }

  for (const { file, content } of results) {
    const hit = content.split('\n').findIndex((l) => /[\u2013\u2014]/.test(l))
    if (hit !== -1) {
      fail(`${path.relative(rootDir, file)}:${hit + 1} contains an en or em dash. Fix it in the source (types JSDoc, story caption or the .docs.md sidecar).`)
    }
  }

  const stale = []
  for (const { file, content } of results) {
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
    if (current === content) continue
    if (check) stale.push(path.relative(rootDir, file))
    else fs.writeFileSync(file, content)
  }
  if (stale.length) {
    fail(`stale, run \`node scripts/generate-component-docs.js ${component}\`:\n  ${stale.join('\n  ')}`)
  }
  console.log(check ? `${component}: up to date` : `${component}: generated`)
}

main()
