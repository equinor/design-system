import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

import { primary as tokens } from './Card.tokens'

const { spacings } = tokens

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :not(:first-child) {
    margin-left: ${spacings.left};
  }
`

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, ...rest }, ref) {
    const props = {
      ...rest,
      ref,
    }

    return <StyledCardHeader {...props}>{children}</StyledCardHeader>
  },
)
