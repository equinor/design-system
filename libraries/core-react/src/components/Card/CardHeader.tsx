import * as React from 'react'
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
  function CardHeader({ children, className = '', ...rest }, ref) {
    const props = {
      ...rest,
      className,
      ref,
    }

    return <StyledCardHeader {...props}>{children}</StyledCardHeader>
  },
)
