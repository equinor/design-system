import React, { forwardRef } from 'react'
import styled from 'styled-components'

type Props = React.HTMLAttributes<HTMLDivElement>

const StyledCardHeaderTitle = styled.div`
  display: grid;
  flex-grow: 2;
  grid-auto-columns: auto;
`

export const CardHeaderTitle = forwardRef<HTMLDivElement, Props>(
  function EdsCardHeaderTitle({ children, className = '', ...rest }, ref) {
    const props = {
      ...rest,
      className,
      ref,
    }

    return <StyledCardHeaderTitle {...props}>{children}</StyledCardHeaderTitle>
  },
)

CardHeaderTitle.displayName = 'eds-card-header-title'
