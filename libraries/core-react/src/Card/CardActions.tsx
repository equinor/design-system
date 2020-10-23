import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Typography } from '../Typography'

type Props = {
  alignRight?: boolean
  meta?: string
} & React.HTMLAttributes<HTMLDivElement>

const StyledCardActions = styled.div<React.CSSProperties>`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
`

export const CardActions = forwardRef<HTMLDivElement, Props>(
  function EdsCardActions(
    { children, className = '', alignRight = false, meta = '', ...rest },
    ref,
  ) {
    const justifyContent = alignRight ? 'flex-end' : 'flex-start'
    const props = {
      ...rest,
      className,
      ref,
      justifyContent,
    }

    return (
      <StyledCardActions {...props}>
        {children}
        {meta !== '' && <Typography variant="caption">{meta}</Typography>}
      </StyledCardActions>
    )
  },
)

// CardActions.displayName = 'eds-card-actions'
