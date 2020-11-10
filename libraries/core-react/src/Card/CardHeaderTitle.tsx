import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'

export type CardHeaderTitleProps = HTMLAttributes<HTMLDivElement>

const StyledCardHeaderTitle = styled.div`
  display: grid;
  flex-grow: 2;
  grid-auto-columns: auto;
`

export const CardHeaderTitle = forwardRef<HTMLDivElement, CardHeaderTitleProps>(
  function CardHeaderTitle({ children, className = '', ...rest }, ref) {
    const props = {
      ...rest,
      className,
      ref,
    }

    return <StyledCardHeaderTitle {...props}>{children}</StyledCardHeaderTitle>
  },
)

// CardHeaderTitle.displayName = 'eds-card-header-title'
