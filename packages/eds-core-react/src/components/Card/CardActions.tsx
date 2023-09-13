import { forwardRef, HTMLAttributes } from 'react'
import type { StyledObject } from 'styled-components'
import { styled } from 'styled-components'
import { Typography } from '../Typography'
import { primary as tokens } from './Card.tokens'

const { spacings } = tokens

export type CardActionsProps = {
  /** Should the actions be right aligned */
  alignRight?: boolean
  /** Meta information */
  meta?: string
} & HTMLAttributes<HTMLDivElement>

/* @Todo styled use styled.div<Pick<CSSObject, 'justifyContent'>>` after Styled components is updated
https://github.com/styled-components/styled-components/pull/4117 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledCardActions = styled.div<Pick<StyledObject<any>, 'justifyContent'>>`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent};
  padding: 0 ${spacings.right} 0 ${spacings.left};
  margin-top: auto;
  &:first-child {
    padding-top: ${spacings.top};
  }
  &:last-child {
    padding-bottom: ${spacings.bottom};
  }
`

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  function CardActions(
    { children, alignRight = false, meta = '', ...rest },
    ref,
  ) {
    const justifyContent = alignRight ? 'flex-end' : 'flex-start'
    const props = {
      ref,
      justifyContent,
      ...rest,
    }

    return (
      <StyledCardActions {...props}>
        {children}
        {meta !== '' && <Typography variant="caption">{meta}</Typography>}
      </StyledCardActions>
    )
  },
)
