import { forwardRef, HTMLAttributes } from 'react'
import { styled } from 'styled-components'
import { primary as tokens } from './Card.tokens'

const { spacings } = tokens

export type CardContentProps = HTMLAttributes<HTMLDivElement>

const StyledCardContent = styled.div`
  display: grid;
  padding: 0 ${spacings.right} 0 ${spacings.left};
  &:last-child {
    padding-bottom: ${spacings.bottom};
  }
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
