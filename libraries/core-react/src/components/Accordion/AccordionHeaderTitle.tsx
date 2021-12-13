import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type AccordionHeaderTitleProps = {
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLSpanElement>

const StyledAccordionHeaderTitle = styled.span<AccordionHeaderTitleProps>(
  ({ theme, isExpanded, disabled }) => {
    return css`
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      font-family: Equinor;
      color: ${isExpanded && !disabled
        ? theme.entities.header.states.active.typography?.color
        : 'inherit'};
    `
  },
)

const AccordionHeaderTitle = forwardRef<
  HTMLSpanElement,
  AccordionHeaderTitleProps
>(function AccordionHeaderTitle({ isExpanded, disabled, children }, ref) {
  return (
    <StyledAccordionHeaderTitle
      ref={ref}
      isExpanded={isExpanded}
      disabled={disabled}
    >
      {children}
    </StyledAccordionHeaderTitle>
  )
})

// AccordionHeaderTitle.displayName = 'AccordionHeaderTitle'

export { AccordionHeaderTitle }
