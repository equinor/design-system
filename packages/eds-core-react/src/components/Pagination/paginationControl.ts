export function PaginationControl(
  pages: number,
  activePage: number,
): (string | number)[] {
  const siblings = 1 // amount of siblings on left and right side of active page after trunking
  const totalPagesShown = 7 // amount of total pages before we start trunking pages in ellipsis
  const pagesBeforeEllipsis = 5 // total pages shown before ellipsis and trunking begins
  const ELLIPSIS = 'ELLIPSIS'

  // Range function from https://dev.to/namirsab/comment/2050
  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  let pageRange: (string | number)[]

  if (pages > 4) {
    const startPage = Math.max(
      1,
      activePage < pagesBeforeEllipsis || pages <= totalPagesShown
        ? 1
        : activePage + siblings + 1 >= pages
        ? pages - 4 // - 4 to fit total columns /
        : activePage > 4 && pages > totalPagesShown
        ? activePage - siblings
        : 1,
    ) // the first page after left ellipsis

    const endOffset =
      activePage < pagesBeforeEllipsis && pages > totalPagesShown
        ? pagesBeforeEllipsis
        : activePage < pagesBeforeEllipsis && pages <= totalPagesShown
        ? pages
        : activePage + siblings + 1 < pages - 1
        ? activePage + siblings
        : activePage + siblings + 1 === pages - 1
        ? pages
        : pages

    const endPage = Math.min(pages, endOffset) // the last page before right ellipsis
    pageRange = range(startPage, endPage) // range in between ellipsis(es). Ex: range(4, 6) =  1 ... ( 4 5 6 )  ... 10

    const hiddenLeft = startPage > 2 && pages > totalPagesShown // Has hidden pages on left side
    const hiddenRight = pages - endPage > 1 && pages > totalPagesShown // Has hidden pages on right side

    if (hiddenLeft && !hiddenRight) {
      pageRange = [1, ELLIPSIS, ...pageRange]
    } else if (!hiddenLeft && hiddenRight) {
      pageRange = [...pageRange, ELLIPSIS, pages]
    } else if (hiddenLeft && hiddenRight) {
      pageRange = [1, ELLIPSIS, ...pageRange, ELLIPSIS, pages]
    }

    return [...pageRange]
  }

  return range(1, pages)
}
