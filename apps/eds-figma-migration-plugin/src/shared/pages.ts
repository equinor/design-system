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
