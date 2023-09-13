import { forwardRef, HTMLAttributes } from 'react'
import { styled, css } from 'styled-components'

export type AccordionHeaderActionsProps = {
  /**  Is AccordionItem expanded */
  isExpanded?: boolean
  /** Accordion item is disabled */
  disabled?: boolean
} & HTMLAttributes<HTMLSpanElement>

const StyledAccordionHeaderActions = styled.span<AccordionHeaderActionsProps>(
  ({ theme, isExpanded, disabled }) => {
    const {
      entities: { header },
    } = theme
    return css`
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: ${header.spacings.right};
      ${disabled
        ? css({
            color: header.states.disabled.typography.color,
            cursor: 'not-allowed',
          })
        : css({
            color: header.typography.color,
            cursor: 'pointer',
          })}
      color: ${isExpanded && !disabled
        ? header.states.active.typography?.color
        : 'inherit'};
    `
  },
)

const AccordionHeaderActions = forwardRef<
  HTMLSpanElement,
  AccordionHeaderActionsProps
>(function AccordionHeaderActions(
  { isExpanded, disabled, children, ...rest },
  ref,
) {
  return (
    <StyledAccordionHeaderActions
      ref={ref}
      isExpanded={isExpanded}
      disabled={disabled}
      {...rest}
    >
      {children}
    </StyledAccordionHeaderActions>
  )
})

export { AccordionHeaderActions }
