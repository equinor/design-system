#!/usr/bin/env node

/**
 * Checks that every published /next component has a section on the breaking
 * changes page, and that no section describes a component that is gone.
 *
 * The page (packages/eds-core-react/stories/docs/BreakingChanges.mdx) exists
 * to spell out the difference between an EDS 1.0 component and its EDS 2.0
 * successor (#5387). That difference does not arrive marked breaking: a whole
 * component is a rewrite of its 1.0 predecessor, and it lands as a plain
 * `feat: add <Component>`. Nothing in /next is formally breaking until
 * graduation.
 *
 * check-breaking-changes-doc.js covers the other side of this: it asks whether
 * a pull request that moves a component brought the page with it. What it
 * cannot see is a component that never had a section to begin with, because it
 * only looks at what a diff touched. So this one does not read the pull
 * request at all. It asks a question about
 * the tree, which holds at any commit: is the page complete?
 *
 *   1. Every component exported from the /next barrel has a `## <Name>`
 *      section.
 *   2. Every component section names a component the barrel still exports, or
 *      one of REMOVED_IN_2 below.
 *   3. Each section says something - a heading and a marker alone do not
 *      describe a migration.
 *
 * What it cannot check is whether a section is accurate or complete against
 * EDS 1.0. That stays a review job.
 *
 * Run by the build job in .github/workflows/checks.yaml, or by hand with
 * `pnpm run check:breaking-changes-coverage`.
 */

const { readFileSync } = require('fs')
const { join } = require('path')

const ROOT = join(__dirname, '..')
const BARREL = 'packages/eds-core-react/src/components/next/index.ts'
const PAGE = 'packages/eds-core-react/stories/docs/BreakingChanges.mdx'
const PAGE_TITLE = 'EDS 2.0 (beta) / Breaking changes'

// Exported from the barrel but not a component a consumer migrates to: Slot is
// the internal `asChild` utility (ADR-0005), with no EDS 1.0 predecessor.
const NOT_A_COMPONENT = new Set(['Slot'])

// Sections kept without a matching export, because the migration is away from
// the component rather than to a successor. Typography is removed in 2.0 in
// favour of the element defaults and the type scale (ADR-0018).
const REMOVED_IN_2 = new Set(['Typography'])

// `##` headings that structure the page rather than describe a component.
const STRUCTURAL = new Set(['Overview', 'Known issues', 'Under review'])

// `export { Button } from './Button'`, including a multi-line list. The module
// name, not the exported names: `export { Menu, MenuItem } from './Menu'` is
// one component with one section, and `useFieldIds` is not a second Field.
const VALUE_EXPORT = /export\s+(type\s+)?\{[^}]*\}\s*from\s+'\.\/([^'/]+)'/g

const SECTION_HEADING = /^## (.+)$/gm

// A `<Tag tone="...">Known issues</Tag>` line is a marker, not a description.
const MARKER_ONLY = /^<Tag\b[^>]*>.*<\/Tag>$/

const read = (file) => readFileSync(join(ROOT, file), 'utf8')

const exportedComponents = (source) => {
  const found = new Set()
  for (const [, isType, module] of source.matchAll(VALUE_EXPORT)) {
    if (!isType && !NOT_A_COMPONENT.has(module)) found.add(module)
  }
  return [...found].sort()
}

/** Each `## ` heading with the body that follows it, up to the next heading. */
const sections = (page) => {
  const headings = [...page.matchAll(SECTION_HEADING)]
  return headings
    .map((match, index) => {
      const next = headings[index + 1]
      return {
        name: match[1].trim(),
        body: page.slice(
          match.index + match[0].length,
          next ? next.index : page.length,
        ),
      }
    })
    .filter((section) => !STRUCTURAL.has(section.name))
}

const isEmpty = (body) =>
  body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .every((line) => MARKER_ONLY.test(line))

/** Written to the job summary as well as the log, so the reason is visible
 * without opening the run. */
const report = (lines) => {
  console.log(lines.join('\n'))
  if (process.env.GITHUB_STEP_SUMMARY) {
    require('fs').appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `${lines.join('\n')}\n`,
    )
  }
}

const main = () => {
  const components = exportedComponents(read(BARREL))
  const found = sections(read(PAGE))
  const names = new Set(found.map((section) => section.name))

  const problems = []

  for (const component of components) {
    if (!names.has(component)) {
      problems.push(
        `- \`${component}\` is exported from \`${BARREL}\` but has no \`## ${component}\` section. Say what changed from the EDS 1.0 component: props, composition, markup and behaviour.`,
      )
    }
  }

  for (const section of found) {
    if (
      !components.includes(section.name) &&
      !REMOVED_IN_2.has(section.name) &&
      !NOT_A_COMPONENT.has(section.name)
    ) {
      problems.push(
        `- \`## ${section.name}\` has no matching export in \`${BARREL}\`. Rename the section if the component was renamed, remove it if the component is gone, or add the name to REMOVED_IN_2 in this script if 2.0 drops it on purpose.`,
      )
    } else if (isEmpty(section.body)) {
      problems.push(
        `- \`## ${section.name}\` is empty. A heading and a marker do not describe a migration.`,
      )
    }
  }

  if (problems.length === 0) {
    report([
      `✅ All ${components.length} published \`/next\` components have a section on the breaking changes page.`,
    ])
    return
  }

  report([
    `❌ The breaking changes page does not match what \`/next\` publishes.`,
    '',
    ...problems,
    '',
    `The page is the Storybook page "${PAGE_TITLE}" (\`${PAGE}\`). It is what consumers read to tell an intended change from a bug, and a component with no section reads as an oversight. A new \`/next\` component is a rewrite of its EDS 1.0 predecessor, so it needs its section in the same pull request that adds it - that is when the difference is known.`,
  ])
  console.log(
    '::error::The breaking changes page does not match what /next publishes',
  )
  process.exitCode = 1
}

/** The published /next components, for check-breaking-changes-doc.js: one
 * definition of what counts as a component, shared by both checks. Reads the
 * working tree, so replaying an old PR by hand uses today's barrel. */
const publishedComponents = () => new Set(exportedComponents(read(BARREL)))

module.exports = { publishedComponents }

if (require.main === module) {
  try {
    main()
  } catch (error) {
    console.error(
      `Could not run the breaking changes coverage check: ${error.message}`,
    )
    process.exitCode = 1
  }
}
