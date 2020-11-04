import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { accordion as tokens } from './Accordion.tokens'

type AccordionHeaderTitleProps = {
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLSpanElement>

const StyledAccordionHeaderTitle = styled.span<AccordionHeaderTitleProps>`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  font-family: Equinor;
  color: ${({ isExpanded, disabled }) =>
    isExpanded && !disabled ? tokens.header.color.activated : 'inherit'};
`

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
