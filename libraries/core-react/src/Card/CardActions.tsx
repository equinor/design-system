import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { Typography } from '../Typography'

export type CardActionProps = {
  /** Should the actions be right aligned */
  alignRight?: boolean
  /** Meta information */
  meta?: string
} & JSX.IntrinsicElements['div']

const StyledCardActions = styled.div<React.CSSProperties>`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
`

export const CardActions = forwardRef<HTMLDivElement, CardActionProps>(
  function CardActions(
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
