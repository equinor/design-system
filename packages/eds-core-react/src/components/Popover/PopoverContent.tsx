import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const ContentWrapper = styled.div(({ theme }) => {
  return css`
    padding: 0 ${theme.spacings.right} 0 ${theme.spacings.left};
    :first-child {
      padding-top: ${theme.spacings.top};
    }
    :last-child {
      padding-bottom: ${theme.spacings.bottom};
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
