import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

export type CardContentProps = HTMLAttributes<HTMLDivElement>

const StyledCardContent = styled.div`
  /* grid-area: con; */
`

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent({ children, ...props }, ref) {
    return (
      <StyledCardContent ref={ref} {...props}>
        {children}
      </StyledCardContent>
    )
  },
)
