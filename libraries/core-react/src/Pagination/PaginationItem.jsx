import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { pagination as tokens } from './Pagination.tokens'
//import { paginationControl } from './paginationControl'

export const PaginationItem = forwardRef(function PaginationItem(
  { page, selected, onClick, ...other },
  ref,
) {
  const props = {
    ref,
    page,
    selected,
    ...other,
  }
  const currentColor = selected ? tokens.selectedColor : null

  if (page === 'ELLIPSIS') {
    return <Typography>...</Typography>
  } else {
    return (
      <Button
        style={{ background: currentColor }}
        variant="ghost_icon"
        onClick={onClick}
        {...props}
      >
        {page}
      </Button>
    )
  }
})

PaginationItem.displayName = 'eds-pagination-item'

PaginationItem.propTypes = {
  // Current page number
  page: PropTypes.number.isRequired,
  // If current page is selected
  selected: PropTypes.bool.isRequired,
  // Click function
  onClick: PropTypes.func,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PaginationItem.defaultProps = {
  className: '',
  onClick: () => {},
  children: undefined,
}
