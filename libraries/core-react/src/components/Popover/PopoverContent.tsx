import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  overflow: hidden;
`
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
