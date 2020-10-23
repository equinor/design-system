import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { paper as tokens, ElevationTypes } from './Paper.tokens'

const { elevation: elevationToken, background } = tokens

type StyledProps = {
  elevation: string
}

const StyledPaper = styled.div<StyledProps>`
  min-width: 96px;
  max-width: calc(100% - 32px);
  background: ${background};
  box-shadow: ${({ elevation }) => elevation};
`

type Props = {
  elevation: ElevationTypes
} & React.HTMLAttributes<HTMLDivElement>

export const Paper = forwardRef<HTMLDivElement, Props>(function EdsPaper(
  { elevation, ...rest },
  ref,
) {
  const props = {
    ...rest,
    elevation: elevationToken[elevation] || 'none',
  }

  return <StyledPaper {...props} ref={ref} />
})

// Paper.displayName = 'eds-scrim'
