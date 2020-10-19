import React, { forwardRef } from 'react'
import { Button } from '../Button'
import { pagination as tokens } from './Pagination.tokens'

type Props = {
  // Current page number
  page: number
  // If current page is selected
  selected: boolean
  // Click function
  onClick?: () => void
}

export const PaginationItem = forwardRef<HTMLButtonElement, Props>(
  function PaginationItem({ page, selected, onClick, ...other }, ref) {
    const props = {
      ref,
      page,
      selected,
      ...other,
    }
    const currentColor = selected ? tokens.selectedColor : null

    return (
      <Button
        style={{ background: currentColor }}
        variant="ghost_icon"
        onClick={onClick ? onClick : undefined}
        {...props}
      >
        {page}
      </Button>
    )
  },
)

PaginationItem.displayName = 'eds-pagination-item'
