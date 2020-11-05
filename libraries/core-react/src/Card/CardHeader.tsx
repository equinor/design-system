import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

import { card as tokens } from './Card.tokens'

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :not(:first-child) {
    margin-left: ${tokens.spacings.left};
  }
`

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader({ children, className = '', ...rest }, ref) {
    const props = {
      ...rest,
      className,
      ref,
    }

    return <StyledCardHeader {...props}>{children}</StyledCardHeader>
  },
)

// CardHeader.displayName = 'eds-card-header'
