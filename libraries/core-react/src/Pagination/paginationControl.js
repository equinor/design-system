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
export function PaginationControl(pages, activePage) {
  //const columns = pages < 5 ? pages + 2 : 7 // Total pages to display on the control + 2:  < and >

  //const [activePage, setActivePage] = useState(1)
  const siblings = 4 // neighboring items on both sides of current page ( 2*2 = 4)

  // const goToPage = (page) => {
  //   const activePage = Math.max(0, Math.min(page, pages))

  //   const pageData = {
  //     activePage,
  //     totalPages: pages,
  //     itemsPerPage: itemsPerPage,
  //     totalItems: totalItems,
  //   }

  //   setActivePage({ activePage }, () => onPageChange(pageData))
  // }

  // const handleClick = (e, value) => {
  //   if (!pageProp) {
  //     setActivePage(value)
  //   }
  //   if (handleChange) {
  //     handleChange(e, value)
  //   }
  // }

  // const moveLeft = (e) => {
  //   e.preventDefault()
  //   goToPage(activePage - siblings * 2 - 1)
  // }

  // const moveRight = (e) => {
  //   e.preventDefault()
  //   goToPage(activePage + siblings * 2 + 1)
  // }

  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  let pageRange
  const totalNumbers = siblings + 3
  const totalColumns = totalNumbers + 2

  if (pages > 4) {
    let extraPages

    const endOffset = activePage < 4 ? activePage + siblings - 1 : activePage
    const startPage = Math.max(1, activePage - siblings)
    const endPage = Math.min(pages, endOffset) // -1 for ellipsis

    pageRange = range(startPage, endPage)

    const hiddenLeft = startPage > 2 // Has hidden pages on left side
    const hiddenRight = pages - endPage > 1 // Has hidden pages on right side
    const hiddenOffset = totalNumbers - pageRange.length + 1 // Number of total hidden pages

    // console.log('hiddens', hiddenLeft, hiddenRight, hiddenOffset)

    if (hiddenLeft && !hiddenRight) {
      extraPages = range(startPage - hiddenOffset, startPage + 1)
      pageRange = [1, ELLIPSIS, ...extraPages, ...pageRange]
      console.log('hiddenleft', extraPages, pageRange)
    } else if (!hiddenLeft && hiddenRight) {
      extraPages = range(endPage + 1, endPage + hiddenOffset - 1)
      pageRange = [...pageRange, ELLIPSIS, pages]
      console.log('hiddenrigth', extraPages, pageRange)
    } else if (hiddenLeft && hiddenRight) {
      pageRange = [1, ELLIPSIS, ...pageRange, ELLIPSIS, pages]
      console.log('both', extraPages, pageRange)
    }
    // console.log(
    //   pageRange,
    //   startPage,
    //   endPage,
    //   extraPages,
    //   hiddenLeft,
    //   hiddenRight,
    // )
    return [...pageRange]
  }
  // Handle page types
  // const pageType = (type) => {
  //   switch (type) {
  //     case 'first':
  //       return 1
  //     case 'previous':
  //       return page - 1
  //     case 'next':
  //       return page + 1
  //     case 'last':
  //       return count
  //     default:
  //       return null
  //   }
  // }

  // const items = pageRange.map((item, index) => {
  //   return typeof item === 'number'
  //     ? {
  //         onClick: (e) => {
  //           handleClick(e, item)
  //         },
  //         page: item,
  //         selected: item === page,
  //         disabled,
  //         'aria-current': item === page ? 'true' : undefined,
  //       }
  //     : {
  //         onClick: (e) => {
  //           handleClick(e, pageType(item))
  //         },
  //         selected: false,
  //         disabled:
  //           item.indexOf('ELLIPSIS') === -1 &&
  //           (item === 'next' || item === 'last' ? page >= pages : page <= 1),
  //       }
  // })

  return range(1, pages)
}
