#!/usr/bin/env node

/**
 * Generates documentation/AI-COMPONENT-INDEX.md — a single-file reference
 * listing every /next component, so AI coding assistants can answer "does X
 * already exist?" without re-walking the source tree every session.
 *
 * Source of truth: packages/eds-core-react/src/components/next/index.ts
 * (the top-level barrel — what consumers can actually import).
 *
 * Re-run via `pnpm run generate:component-index`. Also runs as part of
 * `prebuild`, so a root `pnpm run build` keeps the file fresh (note:
 * `pnpm run build:core-react` does NOT — pre-hooks only fire for the exact
 * script name `build`).
 *
 * `--check` regenerates in memory and exits 1 if the committed file is
 * stale, naming the affected components. Wired into the Checks workflow so
 * a PR that changes the /next API surface without regenerating fails CI.
 */

const fs = require('fs')
const path = require('path')
const { Project, SyntaxKind } = require('ts-morph')

const rootDir = path.resolve(__dirname, '..')
const nextDir = path.join(
  rootDir,
  'packages/eds-core-react/src/components/next',
)
const outputPath = path.join(rootDir, 'documentation/AI-COMPONENT-INDEX.md')

const project = new Project({ skipAddingFilesFromTsConfig: true })

// React-conventional prop names that aren't part of the EDS API surface.
// Listing them per row crowds the table without telling the reader anything.
const REACT_CONVENTIONAL_PROPS = new Set([
  'children',
  'className',
  'style',
  'ref',
  'key',
])

/**
 * Parse the top-level next/ barrel to discover which components are publicly
 * exported. Every PascalCase value re-export becomes its own entry — that way
 * standalone components like `MenuItem` get their own row instead of being
 * folded into `Menu` and losing their props/JSDoc.
 *
 * Returns Array<{ name, dir }>.
 */
function discoverPublicComponents() {
  const barrelPath = path.join(nextDir, 'index.ts')
  const source = project.addSourceFileAtPath(barrelPath)

  const components = []
  const seen = new Set()

  for (const decl of source.getExportDeclarations()) {
    if (decl.isTypeOnly()) continue
    const moduleSpecifier = decl.getModuleSpecifierValue()
    if (!moduleSpecifier || !moduleSpecifier.startsWith('./')) continue

    const dirName = moduleSpecifier.slice(2)
    const dir = path.join(nextDir, dirName)
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue

    for (const namedExport of decl.getNamedExports()) {
      const name = namedExport.getNameNode().getText()
      // PascalCase only — skips hooks (`useFieldIds`) and lowercase utilities.
      if (!/^[A-Z]/.test(name)) continue
      if (seen.has(name)) continue
      seen.add(name)
      components.push({ name, dir })
    }
  }

  return components
}

/**
 * Read JSDoc above a node. Returns the first paragraph as plain text,
 * stripped of `*` markers and trimmed. Returns null if no JSDoc.
 */
function readJsDoc(node) {
  if (!node || typeof node.getJsDocs !== 'function') return null
  const docs = node.getJsDocs()
  if (docs.length === 0) return null
  const text = docs[0].getDescription().trim()
  if (!text) return null
  // First paragraph only — JSDoc may have multiple, separated by blank lines.
  const firstPara = text.split(/\n\s*\n/)[0]
  return firstPara.replace(/\s+/g, ' ').trim()
}

/**
 * Look up the JSDoc-eligible variable declaration for a component, trying
 * the public export name first, then the conventional inner-forwardRef names
 * used by compound components (`<Name>Component`, `<Name>Root`).
 */
function findComponentVariableStatement(tsxSource, componentName) {
  const candidates = [
    componentName,
    `${componentName}Component`,
    `${componentName}Root`,
  ]
  for (const candidate of candidates) {
    const decl = tsxSource
      .getVariableDeclarations()
      .find((d) => d.getName() === candidate)
    if (decl) {
      // JSDoc sits on the VariableStatement, not the declaration itself.
      return decl.getVariableStatement()
    }
  }
  return null
}

/**
 * Find the JSDoc-derived description for a component:
 *   1. JSDoc above the component's `forwardRef` declaration (public name or
 *      compound-pattern inner name)
 *   2. JSDoc above `function ComponentName(...)` (rare in this repo)
 *   3. JSDoc above the `ComponentNameProps` type alias (fallback)
 */
function extractDescription(componentName, tsxSource, propsTypeAlias) {
  if (tsxSource) {
    const statement = findComponentVariableStatement(tsxSource, componentName)
    if (statement) {
      const doc = readJsDoc(statement)
      if (doc) return doc
    }
    const funcDecl = tsxSource
      .getFunctions()
      .find((f) => f.getName() === componentName)
    if (funcDecl) {
      const doc = readJsDoc(funcDecl)
      if (doc) return doc
    }
  }
  if (propsTypeAlias) {
    const doc = readJsDoc(propsTypeAlias)
    if (doc) return doc
  }
  return null
}

/**
 * Extract the EDS-defined property names from a Props type literal. Skips
 * intersected HTML attribute types (which come in as `TypeReference` nodes,
 * unvisited) so the list stays useful — we want the EDS API surface, not
 * every HTMLAttributes prop. Also drops React-conventional names (`children`,
 * `className`, `style`, `ref`, `key`) which aren't an EDS distinction.
 */
function extractPropsFromTypeAlias(typeAlias) {
  const propNames = new Set()

  function visit(typeNode) {
    if (!typeNode) return
    const kind = typeNode.getKind()
    if (kind === SyntaxKind.TypeLiteral) {
      for (const member of typeNode.getMembers()) {
        if (member.getKind() === SyntaxKind.PropertySignature) {
          const name = member.getName()
          if (!REACT_CONVENTIONAL_PROPS.has(name)) {
            propNames.add(name)
          }
        }
      }
    } else if (kind === SyntaxKind.IntersectionType) {
      for (const child of typeNode.getTypeNodes()) {
        visit(child)
      }
    } else if (kind === SyntaxKind.ParenthesizedType) {
      visit(typeNode.getTypeNode())
    }
    // TypeReference (HTMLAttributes<...>, Omit<...>) is intentionally skipped.
  }

  visit(typeAlias.getTypeNode())
  return [...propNames].sort()
}

/**
 * Compound sub-components are defined as
 *   type Compound<Name> = typeof <Name>Root & { Sub1: typeof X1, ... }
 * The alias is matched by exact name (`Compound` + componentName) so an
 * unrelated `type CompoundFoo = ...` helper in the same file can't steal
 * the match. Returns ['Sub1', 'Sub2', ...] or [].
 */
function extractCompoundSubComponents(componentName, tsxSource) {
  if (!tsxSource) return []
  const compoundAlias = tsxSource
    .getTypeAliases()
    .find((t) => t.getName() === `Compound${componentName}`)
  if (!compoundAlias) return []
  const typeNode = compoundAlias.getTypeNode()
  if (!typeNode || typeNode.getKind() !== SyntaxKind.IntersectionType) {
    return []
  }
  const literal = typeNode
    .getTypeNodes()
    .find((n) => n.getKind() === SyntaxKind.TypeLiteral)
  if (!literal) return []
  return literal
    .getMembers()
    .filter((m) => m.getKind() === SyntaxKind.PropertySignature)
    .map((m) => m.getName())
}

/**
 * Returns true if the props type carries an @deprecated JSDoc tag.
 */
function isDeprecated(typeAlias) {
  if (!typeAlias) return false
  for (const doc of typeAlias.getJsDocs()) {
    for (const tag of doc.getTags()) {
      if (tag.getTagName() === 'deprecated') return true
    }
  }
  return false
}

function loadSourceIfExists(filePath) {
  return fs.existsSync(filePath) ? project.addSourceFileAtPath(filePath) : null
}

function extractComponentData({ name, dir }) {
  const tsxSource = loadSourceIfExists(path.join(dir, `${name}.tsx`))
  const typesSource = loadSourceIfExists(path.join(dir, `${name}.types.ts`))

  const propsTypeAlias =
    typesSource &&
    typesSource.getTypeAliases().find((t) => t.getName() === `${name}Props`)

  const props = propsTypeAlias ? extractPropsFromTypeAlias(propsTypeAlias) : []
  const hasAsChild = props.includes('asChild')
  const deprecated = isDeprecated(propsTypeAlias)
  const description = extractDescription(name, tsxSource, propsTypeAlias)
  const compoundSubs = extractCompoundSubComponents(name, tsxSource).map(
    (s) => `${name}.${s}`,
  )

  return {
    name,
    description,
    props,
    subComponents: compoundSubs,
    hasAsChild,
    status: deprecated ? 'deprecated' : 'active',
  }
}

function truncate(str, max) {
  if (!str) return str
  if (str.length <= max) return str
  return str.slice(0, max - 1).trimEnd() + '…'
}

function escapePipe(str) {
  if (!str) return str
  return str.replace(/\\/g, '\\\\').replace(/\|/g, '\\|')
}

function renderTable(rows) {
  const header =
    '| Component | Description | Props | Sub-components | asChild | Status |'
  const sep = '| --- | --- | --- | --- | --- | --- |'
  const body = rows.map((r) => {
    const description = escapePipe(
      r.description ? truncate(r.description, 140) : '—',
    )
    const props = r.props.length === 0 ? '—' : r.props.join(', ')
    const subs = r.subComponents.length === 0 ? '—' : r.subComponents.join(', ')
    const asChild = r.hasAsChild ? '✓' : '—'
    return `| ${r.name} | ${description} | ${props} | ${subs} | ${asChild} | ${r.status} |`
  })
  return [header, sep, ...body].join('\n')
}

function buildContent() {
  const publicComponents = discoverPublicComponents()
  const rows = publicComponents
    .map(extractComponentData)
    .sort((a, b) => a.name.localeCompare(b.name))

  const totalProps = rows.reduce((n, r) => n + r.props.length, 0)
  const withDescription = rows.filter((r) => r.description).length

  const content = `<!-- AUTOGENERATED by scripts/generate-component-index.js — do not edit by hand. -->
<!-- Re-run: pnpm run generate:component-index -->

# EDS 2.0 Component Index (\`/next\`)

This file is the canonical "what already exists" reference for AI coding assistants working in this repo. It is regenerated from the source on every \`pnpm run build\`.

**If you are an AI assistant about to scaffold a new component: check this file first.** The component you are about to build may already exist.

- Source path: \`packages/eds-core-react/src/components/next/<Component>/\`
- Top-level barrel: \`packages/eds-core-react/src/components/next/index.ts\`
- Components: ${rows.length} • Props documented: ${totalProps} • With JSDoc description: ${withDescription}

## Components

${renderTable(rows)}

## Field reference

- **Description** — first paragraph of the JSDoc above the component's \`forwardRef\` declaration (also tries \`<Name>Component\` / \`<Name>Root\` for compound components), with the \`<Name>Props\` type alias as fallback. \`—\` means no JSDoc is present yet; consider adding one.
- **Props** — EDS-defined props only, from the \`<Name>Props\` type literal. Intersected HTML attributes (\`HTMLAttributes<...>\`, \`InputHTMLAttributes<...>\`, etc.) and React-conventional props (\`children\`, \`className\`, \`style\`, \`ref\`, \`key\`) are NOT listed — assume the standard DOM props for the underlying element are available. Known limitation: only inline type literals and intersections are walked — props coming from a referenced local type alias (\`type FooProps = SharedBase & {...}\`) or a union type are not expanded.
- **Sub-components** — compound sub-components attached via the \`Compound<Name>\` type pattern (e.g. \`Field.Label\`, \`Banner.Icon\`). Standalone components exported from the same directory (e.g. \`MenuItem\` from \`./Menu\`) appear as their own rows.
- **asChild** — \`✓\` if the component supports the \`asChild\` polymorphism pattern (see \`Slot/README.md\`).
- **Status** — \`active\` unless the props type carries an \`@deprecated\` JSDoc tag.

## Out of scope

- Components outside \`/next\` (legacy \`packages/eds-core-react/src/components/\`)
- Other packages (\`eds-data-grid-react\`, \`eds-lab-react\`)
- Per-prop type signatures (names only)
- Storybook links
`

  return { content, rows }
}

/**
 * Extract `componentName -> full table row` from generated markdown, so a
 * failed --check can say which components are affected instead of just
 * "files differ".
 */
function tableRowsByName(markdown) {
  const rows = new Map()
  for (const line of markdown.split('\n')) {
    const match = /^\| ([A-Za-z0-9]+) \| /.exec(line)
    if (match && match[1] !== 'Component') {
      rows.set(match[1], line)
    }
  }
  return rows
}

function reportStaleness(committed, generated) {
  const committedRows = tableRowsByName(committed)
  const generatedRows = tableRowsByName(generated)

  const missing = [...generatedRows.keys()].filter(
    (name) => !committedRows.has(name),
  )
  const removed = [...committedRows.keys()].filter(
    (name) => !generatedRows.has(name),
  )
  const changed = [...generatedRows.keys()].filter(
    (name) =>
      committedRows.has(name) &&
      committedRows.get(name) !== generatedRows.get(name),
  )

  if (missing.length > 0) {
    console.error(`  Missing from the index: ${missing.join(', ')}`)
  }
  if (removed.length > 0) {
    console.error(`  No longer exported: ${removed.join(', ')}`)
  }
  if (changed.length > 0) {
    console.error(`  Rows out of date: ${changed.join(', ')}`)
  }
  if (missing.length + removed.length + changed.length === 0) {
    console.error('  Table rows match — header, stats, or prose changed.')
  }
}

function main() {
  const check = process.argv.includes('--check')
  const { content, rows } = buildContent()
  const relativePath = path.relative(rootDir, outputPath)

  if (check) {
    const committed = fs.existsSync(outputPath)
      ? fs.readFileSync(outputPath, 'utf8')
      : ''
    if (committed === content) {
      console.log(`${relativePath} is up to date (${rows.length} components).`)
      return
    }
    console.error(`${relativePath} is stale.`)
    reportStaleness(committed, content)
    console.error(
      '  Run `pnpm run generate:component-index` and commit the result.',
    )
    process.exitCode = 1
    return
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, content)

  console.log(`Wrote ${relativePath} (${rows.length} components).`)
}

main()
