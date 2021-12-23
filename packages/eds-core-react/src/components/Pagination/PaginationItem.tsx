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
>(function PaginationItem({ page, selected, onClick, ...rest }, ref) {
  const props = {
    ref,
    page,
    selected,
    ...rest,
  }
  const background = selected
    ? tokens.entities.item.states.active.background
    : null

  return (
    <Button
      style={{ background }}
      variant="ghost_icon"
      onClick={onClick ? onClick : undefined}
      {...props}
    >
      {page}
    </Button>
  )
})
