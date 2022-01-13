import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export type PopoverActionsProps = HTMLAttributes<HTMLDivElement>

const StyledPopoverActions = styled.div(({ theme }) => {
  return css`
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: column;
    align-items: center;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
    :last-child {
      padding-bottom: ${theme.spacings.bottom};
    }
    :first-child {
      padding-top: ${theme.spacings.top};
    }
  `
})

export const PopoverActions = forwardRef<HTMLDivElement, PopoverActionsProps>(
  function PopoverActions({ children, ...rest }, ref) {
    const props = {
      ref,
      ...rest,
    }

    return <StyledPopoverActions {...props}>{children}</StyledPopoverActions>
  },
)
