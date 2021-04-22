import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import type { CSSObject } from 'styled-components'
import { Typography } from '../Typography'

export type CardActionsProps = {
  /** Should the actions be right aligned */
  alignRight?: boolean
  /** Meta information */
  meta?: string
} & HTMLAttributes<HTMLDivElement>

const StyledCardActions = styled.div<Pick<CSSObject, 'justifyContent'>>`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
`

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
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
