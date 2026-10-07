#!/usr/bin/env node

/**
 * Generates the Storybook docs page for a component on both platforms from
 * the same inputs. With no component name it processes every component that
 * has a web sidecar.
 *
 *   node scripts/generate-component-docs.js [Component...] [--check]
 *
 * Inputs, per platform (web = eds-core-react /next, mobile = eds-mobile-components).
 * They live in the folder that holds {Component}.tsx, which is not always a
 * folder of the same name (mobile Checkbox, Radio and Switch share
 * SelectionControls/):
 *   {Component}Props        a `type` or `interface` in any file of that folder:
 *                           props, types, defaults, descriptions (JSDoc)
 *   {Component}.stories.tsx example code and captions
 *   {Component}.docs.md     the hand-written part: Summary, Usage,
 *                           Accessibility, Related components
 *   {Component}.figma.tsx   Figma URL (web folder only, optional)
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

// Optional sidecar section with `- ARIA: <url>` and `- Docs: <page>` lines.
const OPTIONAL_SIDECAR_SECTIONS = ['Links']

const DOCS_SITE = 'https://eds.equinor.com/docs/Next/components'
const DOCS_SITE_DIR = 'apps/design-system-docs/docs/components'

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

const GITHUB_BLOB = 'https://github.com/equinor/design-system/blob/main'

const PLATFORMS = {
  web: {
    componentsRoot: 'packages/eds-core-react/src/components/next',
    out: (c) =>
      `packages/eds-core-react/src/components/next/${c}/${c}.docs.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-core-react/next'`,
    installLine: 'npm install @equinor/eds-core-react@beta',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-core-react',
    skipStories: new Set(['Introduction']),
  },
  mobile: {
    componentsRoot: 'packages/eds-mobile-components/src/components',
    out: (c) => `packages/eds-mobile-components/docs/${c}.mdx`,
    importLine: (c) => `import { ${c} } from '@equinor/eds-mobile-components'`,
    installLine: 'npm install @equinor/eds-mobile-components',
    npmUrl: 'https://www.npmjs.com/package/@equinor/eds-mobile-components',
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

// Finds the folder that holds {Component}.tsx, in the components root or one
// level below it.
function locate(cfg, component) {
  const root = path.join(rootDir, cfg.componentsRoot)
  const folders = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'node_modules')
    .map((d) => path.join(root, d.name))
  for (const dir of [root, ...folders]) {
    const file = path.join(dir, `${component}.tsx`)
    if (fs.existsSync(file)) return { dir, file }
  }
  return null
}

const githubUrl = (file) => `${GITHUB_BLOB}/${path.relative(rootDir, file)}`

// {Component}Props may be a type alias or an interface, in any non-test file of
// the component's folder (a shared types.ts, or the component file itself).
function findPropsDeclaration(project, dir, component) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f))
  for (const f of files) {
    const sf = project.addSourceFileAtPath(path.join(dir, f))
    const decl =
      sf.getTypeAlias(`${component}Props`) ??
      sf.getInterface(`${component}Props`)
    if (decl) return decl
  }
  return fail(
    `no ${component}Props type or interface in ${path.relative(rootDir, dir)}`,
  )
}

// One Figma component serves both platforms, so the web Code Connect file is
// the source for both pages.
function readFigmaUrl(webDir, component) {
  const file = path.join(webDir, `${component}.figma.tsx`)
  if (!fs.existsSync(file)) return undefined
  return fs
    .readFileSync(file, 'utf8')
    .match(/https:\/\/www\.figma\.com\/[^'"\s]+/)?.[0]
}

// The docs-site page for a component. Pages are named after the lowercased
// component (inputs/textfield.md), except where one page covers several
// components (inputs/selection_controls.md), which the sidecar names with
// `- Docs: inputs/selection_controls`.
function docsPageUrl(component, override) {
  const root = path.join(rootDir, DOCS_SITE_DIR)
  if (override) {
    if (!fs.existsSync(path.join(root, `${override}.md`))) {
      fail(`${component}: Docs page ${override} not found in ${DOCS_SITE_DIR}`)
    }
    return `${DOCS_SITE}/${override}`
  }
  const file = `${component.toLowerCase()}.md`
  const category = fs
    .readdirSync(root, { withFileTypes: true })
    .find(
      (d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, file)),
    )
  return category
    ? `${DOCS_SITE}/${category.name}/${file.replace(/\.md$/, '')}`
    : undefined
}

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

// One Links row. `urls` is in display order, `indent` is for nesting.
function renderLinks(urls, indent = '') {
  const attrs = Object.entries(urls)
    .filter(([, value]) => value)
    .map(([name, value]) => `${indent}  ${name}="${value}"`)
    .join('\n')
  return `${indent}<Links\n${attrs}\n${indent}/>`
}

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

const fromLibrary = (node) =>
  node.getSourceFile().getFilePath().includes('/node_modules/')

// Props declared in this repo. Props inherited from HTMLAttributes / ViewProps
// live in node_modules and are skipped.
function extractProps(declaration) {
  const props = []
  for (const symbol of declaration.getType().getProperties()) {
    const decl = symbol.getDeclarations()[0]
    if (!decl || !Node.isPropertySignature(decl) || fromLibrary(decl)) continue

    const jsDoc = decl.getJsDocs()[0]
    const description = (jsDoc?.getDescription() ?? '')
      .trim()
      .replace(/\s+/g, ' ')
    const defaultTag = jsDoc
      ?.getTags()
      .find((t) => t.getTagName() === 'default')
    const typeNode = decl.getTypeNode()

    // Expand a reference to a local alias (e.g. BadgeTone) into its members.
    let resolved = typeNode
    const valueNotes = {}
    if (Node.isTypeReference(typeNode)) {
      const name = typeNode.getTypeName()
      const local = Node.isIdentifier(name)
        ? name
            .getSymbol()
            ?.getDeclarations()
            .find((d) => Node.isTypeAliasDeclaration(d) && !fromLibrary(d))
        : undefined
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
    body = body
      .getFirstDescendantByKind(SyntaxKind.ReturnStatement)
      ?.getExpression()
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
  return /^[A-Z][a-z]/.test(text)
    ? text.charAt(0).toLowerCase() + text.slice(1)
    : text
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
    const description = p.optional
      ? p.description
      : `${p.description} Required.`
    return `| \`${p.name}\` | \`${type}\` | ${p.default ? `\`${p.default}\`` : 'None'} | ${description} |`
  })
  return [
    '| Prop | Type | Default | Description |',
    '|---|---|---|---|',
    ...rows,
  ].join('\n')
}

const fencedCode = (md) =>
  md.match(/```tsx\n([\s\S]*?)\n```/)?.[1] ??
  fail('sidecar Usage needs a ```tsx block')

function generatedNote(component, relDir) {
  return `{/* Generated by scripts/generate-component-docs.js. Do not edit. Edit ${relDir}/${component}.docs.md, the ${component}Props type or ${component}.stories.tsx instead. */}`
}

function renderMobile(component, ctx) {
  const p = PLATFORMS.mobile
  const examples = ctx.stories
    .map(
      (s) =>
        `### ${s.title}\n\n${s.caption ? `${s.caption}\n\n` : ''}\`\`\`tsx\n${s.code}\n\`\`\``,
    )
    .join('\n\n')
  return `${generatedNote(component, ctx.relDir)}

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
  const links = renderLinks({
    figmaUrl: ctx.figmaUrl,
    documentationUrl: ctx.docsUrl,
    ariaUrl: ctx.ariaUrl,
    sourceUrl: ctx.sourceUrl,
    npmUrl: p.npmUrl,
  })
  const mobileLinks = renderLinks(
    {
      figmaUrl: ctx.figmaUrl,
      sourceUrl: ctx.mobileSourceUrl,
      npmUrl: mobile.npmUrl,
    },
    '  ',
  )
  const examples = ctx.stories
    .map(
      (s) =>
        `### ${s.title}\n\n${s.caption ? `${s.caption}\n\n` : ''}<Canvas of={Stories.${s.name}} />`,
    )
    .join('\n\n')
  // The React Native tab only exists for components that have a mobile sidecar.
  const tabsOpen = ctx.hasMobile
    ? `<PlatformTabs mobile={<>
${mobileLinks}
  <MobileDocs />
</>}>

`
    : ''
  const tabsClose = ctx.hasMobile ? '\n</PlatformTabs>\n' : ''
  const imports = ctx.hasMobile
    ? `import { Links, PlatformTabs } from './../../../../.storybook/components'
import MobileDocs from '@equinor/eds-mobile-components/docs/${component}.mdx'`
    : `import { Links } from './../../../../.storybook/components'`
  return `${generatedNote(component, ctx.relDir)}

import { Meta, Primary, Controls, Canvas } from '@storybook/addon-docs/blocks'
import * as Stories from './${component}.stories'
${imports}

<Meta of={Stories} />

# ${component}

${ctx.sidecar.Summary}

${BETA_CALLOUT}

${tabsOpen}${links}

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
${tabsClose}`
}

// A component is documented when its web directory has a sidecar. The mobile
// side is optional: only components that exist in React Native have one.
function discoverComponents() {
  const nextDir = path.join(
    rootDir,
    'packages/eds-core-react/src/components/next',
  )
  return fs
    .readdirSync(nextDir)
    .filter((c) => fs.existsSync(path.join(nextDir, c, `${c}.docs.md`)))
    .sort()
}

function buildPages(project, component) {
  const found = {
    web: locate(PLATFORMS.web, component),
    mobile: locate(PLATFORMS.mobile, component),
  }
  if (!found.web) fail(`${component}: no web component found`)
  const hasMobile =
    found.mobile !== null &&
    fs.existsSync(path.join(found.mobile.dir, `${component}.docs.md`))

  const pages = []
  for (const [platform, cfg] of Object.entries(PLATFORMS)) {
    if (platform === 'mobile' && !hasMobile) continue
    const { dir, file } = found[platform]
    const sidecar = readSidecar(path.join(dir, `${component}.docs.md`))
    const sidecarLinks = parseLinks(sidecar.Links)
    const ctx = {
      relDir: path.relative(rootDir, dir),
      props: extractProps(findPropsDeclaration(project, dir, component)),
      stories: extractStories(
        project,
        path.join(dir, `${component}.stories.tsx`),
        cfg.skipStories,
      ),
      sidecar,
      figmaUrl: readFigmaUrl(found.web.dir, component),
      docsUrl: docsPageUrl(component, sidecarLinks.Docs),
      ariaUrl: sidecarLinks.ARIA,
      sourceUrl: githubUrl(file),
      mobileSourceUrl: hasMobile ? githubUrl(found.mobile.file) : undefined,
      hasMobile,
    }
    const content =
      platform === 'web'
        ? renderWeb(component, ctx)
        : renderMobile(component, ctx)
    pages.push({ file: path.join(rootDir, cfg.out(component)), content })
  }

  for (const { file, content } of pages) {
    const hit = content.split('\n').findIndex((l) => /[\u2013\u2014]/.test(l))
    if (hit !== -1) {
      fail(
        `${path.relative(rootDir, file)}:${hit + 1} contains an en or em dash. Fix it in the source (types JSDoc, story caption or the .docs.md sidecar).`,
      )
    }
  }
  return pages
}

function main() {
  const args = process.argv.slice(2)
  const check = args.includes('--check')
  const named = args.filter((a) => !a.startsWith('--'))
  const components = named.length ? named : discoverComponents()
  const project = new Project({ skipAddingFilesFromTsConfig: true })

  const stale = []
  for (const component of components) {
    for (const { file, content } of buildPages(project, component)) {
      const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
      if (current === content) continue
      if (check) stale.push(path.relative(rootDir, file))
      else fs.writeFileSync(file, content)
    }
  }
  if (stale.length) {
    fail(
      `stale, run \`pnpm run generate:component-docs\`:\n  ${stale.join('\n  ')}`,
    )
  }
  console.log(`${components.join(', ')}: ${check ? 'up to date' : 'generated'}`)
}

if (require.main === module) main()

module.exports = {
  locate,
  findPropsDeclaration,
  extractProps,
  docsPageUrl,
  parseLinks,
}
