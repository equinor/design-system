import * as React from 'react'
import { forwardRef, MouseEvent, KeyboardEvent } from 'react'
import { Button } from '../Button'
import { pagination as tokens } from './Pagination.tokens'

type PaginationItemProps = {
  // Current page number
  page: number
  // If current page is selected
  selected: boolean
  // Click function
  onClick?: (event: MouseEvent | KeyboardEvent) => void
}

export const PaginationItem = forwardRef<
  HTMLButtonElement,
  PaginationItemProps
>(function PaginationItem({ page, selected, onClick, ...other }, ref) {
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
})

// PaginationItem.displayName = 'eds-pagination-item'
