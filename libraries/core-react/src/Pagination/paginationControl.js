import React, { useState } from 'react'

export default function paginationControl(page, onChange, pages, ...other) {
  const [pageState, setPageState] = useState(page)

  const handleClick = (e, value) => {
    if (!page) {
      setPageState(value)
    }
    if (onChange) {
      onChange(e, value)
    }

    return {}
  }
}
