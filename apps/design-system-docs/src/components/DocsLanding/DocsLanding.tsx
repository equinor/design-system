import type { ReactNode } from 'react'

export type DocsLandingProps = {
  children: ReactNode
}

/**
 * Opts an MDX doc into the **landing layout**: the content breaks out of the
 * Docusaurus docs wrapper to full viewport width, matching the React landing
 * pages (/foundation, /getting-started, /about). Pair with frontmatter
 * `hide_table_of_contents: true` and `displayed_sidebar: null`, and use
 * <Hero> + `<section className="docs-section">` inside — the same building
 * blocks the React pages use.
 *
 * Docs without this wrapper use the default doc layout (sidebar + TOC + column).
 *
 * The full-width CSS lives in src/css/custom.css (`.docs-landing`) because it
 * targets `main`/`.col` ancestors of the doc content.
 */
export function DocsLanding({ children }: DocsLandingProps) {
  return <div className="docs-landing">{children}</div>
}

DocsLanding.displayName = 'DocsLanding'
