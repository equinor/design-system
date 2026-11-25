/**
 * The pages a scan of the file reads. The designer can leave pages out in
 * the page picker; the file keeps the pages left out, so a page added later
 * is scanned until someone leaves it out too.
 */

/** A page in the file, in the order of Figma's page list. */
export type FilePage = {
  id: string
  name: string
  /** A page divider: a line in the page list, with nothing on it to scan */
  divider?: boolean
}

/** The pages that can be scanned: every page but the dividers. */
export function scannablePages(pages: FilePage[]): FilePage[] {
  return pages.filter((page) => !page.divider)
}

/** The ids of the pages a scan of the file reads, in the file's order. */
export function pagesToScan(
  pages: FilePage[],
  leftOut: Iterable<string>,
): string[] {
  const skip = new Set(leftOut)
  return scannablePages(pages)
    .filter((page) => !skip.has(page.id))
    .map((page) => page.id)
}

/** “5/8 pages”, for the line beside Select pages. */
export function pageCountText(pages: FilePage[], leftOut: Iterable<string>) {
  const total = scannablePages(pages).length
  const selected = pagesToScan(pages, leftOut).length
  return `${selected}/${total} ${total === 1 ? 'page' : 'pages'}`
}

/**
 * What a scan covers, as a key that is the same for two scans of the same
 * layers: the selected layers, the page, or the pages of the file. The
 * window keeps the result of an Apply, Convert or Revert only while the
 * scans that follow cover the same (test session 2, 2026-11-25: the result
 * of an Apply on one page stayed above the health of the next page scanned).
 */
export function scanKey(target: {
  scope: 'selection' | 'page' | 'file'
  pageId: string
  nodeIds: string[]
  pageIds?: string[]
}): string {
  switch (target.scope) {
    case 'selection':
      return `selection:${target.pageId}:${[...target.nodeIds].sort().join(',')}`
    case 'page':
      return `page:${target.pageId}`
    case 'file':
      return `file:${(target.pageIds ?? []).join(',')}`
  }
}
