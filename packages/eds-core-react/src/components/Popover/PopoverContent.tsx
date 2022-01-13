import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const ContentWrapper = styled.div(({ theme }) => {
  return css`
    overflow: hidden;
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
    :last-child {
      padding-top: ${theme.spacings.top};
      padding-bottom: ${theme.spacings.bottom};
    }
    :nth-last-child(2) {
      padding-top: ${theme.spacings.top};
    }
  `
})

export type PopoverContentProps = HTMLAttributes<HTMLDivElement>

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }
    return <ContentWrapper {...props}>{children}</ContentWrapper>
  },
)

// PopoverContent.displayName = 'eds-popover-content'
