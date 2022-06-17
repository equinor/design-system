import { forwardRef } from 'react'
import styled from 'styled-components'
import {
  paper as tokens,
  ElevationTypes,
  elevation as elevationToken,
} from './Paper.tokens'

type StyledProps = {
  elevation: string
}

const StyledPaper = styled.div<StyledProps>`
  background: ${tokens.background};
  box-shadow: ${({ elevation }) => elevation};
`

export type PaperProps = {
  elevation: ElevationTypes
} & React.HTMLAttributes<HTMLDivElement>

export const Paper = forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { elevation, ...rest },
  ref,
) {
  const props = {
    ...rest,
    elevation: elevationToken[elevation] || 'none',
  }

  return <StyledPaper {...props} ref={ref} />
})
