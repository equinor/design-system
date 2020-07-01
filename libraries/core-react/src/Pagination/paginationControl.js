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

  const [pageState, setPageState] = useState(null)

  const handleClick = (e, value) => {
    if (!pageProp) {
      setPageState(value)
    }
    if (onChange) {
      onChange(e, value)
    }
  }

  return {
    items,
    ...other,
  }
}
