import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type AccordionHeaderActionsProps = {
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLSpanElement>

const StyledAccordionHeaderActions = styled.span<AccordionHeaderActionsProps>(
  ({ theme, isExpanded, disabled }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: flex-end;
      grid-column: 5 / 10;
      grid-row: 1 / 1;
      color: ${isExpanded && !disabled
        ? theme.entities.header.states.active.typography?.color
        : 'inherit'};
    `
  },
)

const AccordionHeaderActions = forwardRef<
  HTMLSpanElement,
  AccordionHeaderActionsProps
>(function AccordionHeaderActions({ isExpanded, disabled, children }, ref) {
  return (
    <StyledAccordionHeaderActions
      ref={ref}
      isExpanded={isExpanded}
      disabled={disabled}
    >
      {children}
    </StyledAccordionHeaderActions>
  )
})

export { AccordionHeaderActions }
