import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledPopoverHeader = styled.div`
  display: flex;
`

export const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(
  function PopoverHeader({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return <StyledPopoverHeader {...props}>{children}</StyledPopoverHeader>
  },
)
