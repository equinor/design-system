/**
 * Finds the steps of the demo that the docs pages show. A docs page about
 * the plugin imports its components from MigrationPlugin and names a step
 * with `step="…"`, for an image of the window at that step. The sync script
 * copies the images of these steps, and a test checks that the demo has
 * each of them.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The docs site, next to the plugin in the monorepo. `EDS_DOCS_APP` points
 * the sync at the docs app in another checkout, such as a worktree with a
 * docs branch while the pages and the plugin are on different branches.
 */
export const DOCS_APP = process.env.EDS_DOCS_APP
  ? resolve(process.env.EDS_DOCS_APP)
  : join(root, '../design-system-docs')

/** Where the docs pages are, for the current (Beta) version */
const DOCS_PAGES = join(DOCS_APP, 'docs')

/** A page uses the plugin's images when it imports from this module */
const COMPONENT_MODULE = '@site/src/components/MigrationPlugin/MigrationPlugin'

const STEP_PROP = /\bstep="([a-z-]+)"/g

function mdxFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) return mdxFiles(path)
    return entry.name.endsWith('.mdx') ? [path] : []
  })
}

/**
 * The steps one page names, in the order they appear. A page that does not
 * import the plugin's components names none.
 */
export function stepsInPage(source) {
  if (!source.includes(COMPONENT_MODULE)) return []
  return [...source.matchAll(STEP_PROP)].map(([, step]) => step)
}

/**
 * Every step a docs page names, with the pages that name it, relative to the
 * docs app. Sorted by step. Empty until a page uses the plugin's images.
 */
export function docsSteps() {
  const steps = new Map()
  for (const file of mdxFiles(DOCS_PAGES)) {
    for (const step of stepsInPage(readFileSync(file, 'utf8'))) {
      const pages = steps.get(step) ?? []
      const page = relative(DOCS_APP, file)
      if (!pages.includes(page)) pages.push(page)
      steps.set(step, pages)
    }
  }
  return [...steps]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([step, pages]) => ({ step, pages }))
}
