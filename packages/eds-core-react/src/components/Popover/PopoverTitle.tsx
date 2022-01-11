import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const StyledPopoverTitle = styled.div(({ theme }) => {
  return css`
    max-width: ${theme.maxWidth};
    margin-right: ${theme.spacings.right};
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
