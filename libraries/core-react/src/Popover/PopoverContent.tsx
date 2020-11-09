import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  overflow: hidden;
`
type Props = HTMLAttributes<HTMLDivElement>

export const PopoverContent = forwardRef<HTMLDivElement, Props>(
  function EdsPopoverContent({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }
    return <ContentWrapper {...props}>{children}</ContentWrapper>
  },
)

// PopoverContent.displayName = 'eds-popover-content'
