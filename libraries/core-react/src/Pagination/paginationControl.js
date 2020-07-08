import React, { useState } from 'react'

/* 

SiblingCount / Siblings
default 1 - visible pages before and after current page

* Number of always visible pages at the beginning and end.
   * @default 1
  boundaryCount: PropTypes.number,

  Count = PAGES

  page = current page

*/

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'
const ELLIPSIS = 'ELLIPSIS'

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line import/no-default-export
export function PaginationControl(pages, onPageChange) {
  const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >
  // const items = paginationControl(pages)
  const [activePage, setActivePage] = useState(1)
  const siblings = 4 // neighboring items on both sides of current page ( 2*2 = 4)

  const goToPage = (page) => {
    const { onPageChange = (f) => f } = this.props
    const activePage = Math.max(0, Math.min(page, pages))

    const pageData = {
      activePage,
      totalPages: pages,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
    }

    setActivePage({ activePage }, () => onPageChange(pageData))
  }

  const handleClick = (page) => (e) => {
    e.preventDefault()
    goToPage(page)
  }

  const moveLeft = (e) => {
    e.preventDefault()
    goToPage(activePage - siblings * 2 - 1)
  }

  const moveRight = (e) => {
    e.preventDefault()
    goToPage(activePage + siblings * 2 + 1)
  }

  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  let pageRange
  const totalNumbers = siblings + 3
  const totalColumns = totalNumbers + 2

  if (pages > 4) {
    let extraPages

    const startPage = Math.max(1, activePage - siblings)
    const endPage = Math.min(pages, activePage + siblings)

    pageRange = range(startPage, endPage)

    const hiddenLeft = startPage > 2 // Has hidden pages on left side
    const hiddenRight = pages - endPage > 1 // Has hidden pages on right side
    const hiddenOffset = totalNumbers - pageRange.length + 1 // Number of total hidden pages

    // console.log('hiddens', hiddenLeft, hiddenRight, hiddenOffset)

    if (hiddenLeft && !hiddenRight) {
      extraPages = range(startPage - hiddenOffset, startPage + 1)
      pageRange = [1, ELLIPSIS, ...extraPages, ...pageRange]
    } else if (!hiddenLeft && hiddenRight) {
      extraPages = range(endPage + 1, endPage + hiddenOffset - 1)
      pageRange = [...pageRange, ELLIPSIS, ...extraPages]
    } else if (hiddenLeft && hiddenRight) {
      pageRange = [LEFT_PAGE, ...pageRange, RIGHT_PAGE]
    }

    return [...pageRange]
  }

  return range(1, pages)
}
