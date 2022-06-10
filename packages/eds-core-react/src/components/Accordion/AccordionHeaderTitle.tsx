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
    const {
      entities: { header },
    } = theme
    return css`
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      flex-grow: 1;
      overflow: hidden;
      text-align: left;
      color: ${isExpanded && !disabled
        ? header.states.active.typography?.color
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
