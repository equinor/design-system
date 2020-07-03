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

export default function PaginationControl(props = {}) {
  const { onChange: handleChange, page: pageProp, pages, ...other } = props

  const handleClick = (e, value) => {
    if (!pageProp) {
      setPageState(value)
    }
    if (onChange) {
      onChange(e, value)
    }
  }

  const [activePage, setActivePage] = useState(1)

  const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >
  const items = paginationControl(pages)
  const siblings = 2 // neighboring items on both sides of current page

  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  if (pages > 5) {
    let extraPages

    const startPage = Math.max(2, activePage - siblings)
    const endPage = Math.min(pages - 1, activePage + siblings)

    let pageRange = range(startPage, endPage)

    const hiddenLeft = startPage > 2 // Has hidden pages on left side
    const hiddenRight = pages - endPage > 1 // Has hidden pages on right side
    const hiddenOffset = 5 - pageRange.length + 1 // Number of total hidden pages

    if (hiddenLeft && !hiddenRight) {
      extraPages = range(startPage - hiddenOffset, startPage - 1)
      pageRange = [LEFT_PAGE, ...extraPages, ...pageRange]
    } else if (!hiddenLeft && hiddenRight) {
      extraPages = range(endPage + 1, endPage + hiddenOffset)
      pageRange = [...pageRange, ...extraPages, RIGHT_PAGE]
    } else if (hiddenLeft && hiddenRight) {
      pageRange = [LEFT_PAGE, ...pageRange, RIGHT_PAGE]
    }

    console.log([1, ...pageRange, pages])
  }

  console.log(pages, columns)

  return {
    items,
    ...other,
  }
}
