import * as React from 'react'
import { forwardRef } from 'react'
import styled from 'styled-components'
import {
  paper as tokens,
  ElevationTypes,
  elevation as elevationToken,
} from './Paper.tokens'

const { background } = tokens

type StyledProps = {
  elevation: string
}

const StyledPaper = styled.div<StyledProps>`
  min-width: 96px;
  max-width: calc(100% - 32px);
  background: ${background};
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
