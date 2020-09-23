// @ts-nocheck
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { paper as tokens } from './Paper.tokens'

const { elevation: elevationToken, background } = tokens

const StyledPaper = styled.div`
  min-width: 96px;
  max-width: calc(100% - 32px);
  background: ${background};
  box-shadow: ${({ elevation }) => elevation};
`

export const Paper = forwardRef(function EdsPaper({ elevation, ...rest }, ref) {
  const props = {
    ...rest,
    elevation: elevationToken[elevation] || 'none',
  }

  return <StyledPaper {...props} ref={ref} />
})

Paper.displayName = 'eds-scrim'

Paper.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Function to handle closing scrim */
  elevation: PropTypes.oneOf([
    'raised',
    'none',
    'overlay',
    'sticky',
    'temporary_nav',
    'above_scrim',
  ]),
}

Paper.defaultProps = {
  className: '',
  children: undefined,
  elevation: 'none',
}
