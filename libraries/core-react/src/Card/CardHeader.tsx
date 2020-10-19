import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { card as tokens } from './Card.tokens'

type Props = React.HTMLAttributes<HTMLDivElement>

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > :not(:first-child) {
    margin-left: ${tokens.spacings.left};
  }
`

export const CardHeader = forwardRef<HTMLDivElement, Props>(function EdsCardHeader(
  {
    children,
    className = '',
    ...rest
  },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return <StyledCardHeader {...props}>{children}</StyledCardHeader>
})

CardHeader.displayName = 'eds-card-header'
