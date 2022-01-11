import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const StyledPopoverTitle = styled.div(({ theme }) => {
  return css`
    margin-right: ${theme.entities.closeButton.width};
    max-width: calc(${theme.maxWidth} - ${theme.entities.closeButton.width});
    overflow: hidden;
  `
})

export type PopoverTitleProps = HTMLAttributes<HTMLDivElement>

export const PopoverTitle = forwardRef<HTMLDivElement, PopoverTitleProps>(
  function PopoverTitle({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return <StyledPopoverTitle {...props}>{children}</StyledPopoverTitle>
  },
)
