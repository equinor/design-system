import React from 'react'

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'
const ELLIPSIS = 'ELLIPSIS'

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-default-export
export function PaginationControl(pages, activePage) {
  const siblings = 1 // neighboring items on both sides of current page ( 2*2 = 4)

  // https://dev.to/namirsab/comment/2050
  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  let pageRange
  const totalNumbers = siblings + 3
  const totalColumns = totalNumbers + 2

  if (pages > 4) {
    let extraPages

    const endOffset =
      activePage < 5
        ? 5
        : activePage + siblings + 1 < pages
        ? activePage + siblings
        : activePage + siblings + 1 === pages
        ? pages
        : pages

    const startPage = Math.max(
      1,
      activePage < 5
        ? 1
        : activePage + siblings + 1 >= pages
        ? pages - 4
        : activePage - siblings,
    ) // the first page after ellipsis
    const endPage = Math.min(pages, endOffset) // the last page before ellipsis
    pageRange = range(startPage, endPage) // range in between ellipsis(es). Ex: range(4, 6) =  1 ... 4 5 6 ... 10

    console.log(activePage + siblings + 1, activePage - 1, pages, endOffset)
    const hiddenLeft = startPage > 2 // Has hidden pages on left side
    const hiddenRight = pages - endPage > 1 // Has hidden pages on right side
    const hiddenOffset = totalNumbers - pageRange.length + 1 // Number of total hidden pages

    if (hiddenLeft && !hiddenRight) {
      extraPages = range(startPage - hiddenOffset, startPage + 1)
      pageRange = [1, ELLIPSIS, ...pageRange]
    } else if (!hiddenLeft && hiddenRight) {
      extraPages = range(endPage + 1, endPage + hiddenOffset - 1)
      pageRange = [...pageRange, ELLIPSIS, pages]
    } else if (hiddenLeft && hiddenRight) {
      pageRange = [1, ELLIPSIS, ...pageRange, ELLIPSIS, pages]
    }

    return [...pageRange]
  }

  return range(1, pages)
}
