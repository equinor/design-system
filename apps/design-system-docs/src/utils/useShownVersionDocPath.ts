import { useDocsVersionCandidates } from '@docusaurus/plugin-content-docs/client'

/** A landing-page card target: a doc id, and a link to use if it is missing. */
export type VersionedDocTarget = {
  /** Doc id in the current (Beta) docs. */
  docId: string
  /**
   * The doc to open instead in a version that has no doc with `docId`, keyed
   * by version name. Latest has no design tokens or assets overview, so those
   * cards open the page its sidebar category opens.
   */
  docIdByVersion?: Record<string, string>
  /** Used when the version the dropdown shows has neither doc. */
  to: string
}

/**
 * Resolves landing-page cards to the version the navbar dropdown shows: the
 * version the reader picked, or Latest. The landing pages are not versioned, so
 * a fixed link would open one version whatever the dropdown says (#5667).
 *
 * Needs the docs context that `@theme/Layout` provides, so call it from a
 * component rendered inside `<Layout>`, not from the page component itself.
 */
export function useShownVersionDocPath(): (
  target: VersionedDocTarget,
) => string {
  const version = useShownDocsVersion()
  return ({ docId, docIdByVersion, to }) => {
    const id = docIdByVersion?.[version.name] ?? docId
    return version.docs.find((doc) => doc.id === id)?.path ?? to
  }
}

/**
 * The docs version the navbar dropdown shows, for content that differs by
 * version, such as a badge that only describes Beta. Same context rule as
 * `useShownVersionDocPath`.
 */
export function useShownDocsVersion(): ReturnType<
  typeof useDocsVersionCandidates
>[number] {
  const [version] = useDocsVersionCandidates()
  return version
}
