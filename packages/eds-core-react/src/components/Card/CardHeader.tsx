import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

import { primary as tokens } from './Card.tokens'

const { spacings } = tokens

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${spacings.right} 0 ${spacings.left};

  > :not(:first-child) {
    margin-left: ${spacings.left};
  }
  &:first-child {
    padding-top: ${spacings.top};
  }
  &:last-child {
    padding-bottom: ${spacings.bottom};
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
