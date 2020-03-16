import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'

const { height, width, background, position, zIndex } = tokens

const StyledScrim = styled.div`
  width: ${width};
  height: ${height};
  background: ${background};
  position: ${position};
  z-index: ${zIndex};
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Scrim = forwardRef(function EdsScrim({ children, ...props }, ref) {
  return (
    <StyledScrim {...props} ref={ref}>
      {children}
    </StyledScrim>
  )
})

Scrim.displayName = 'eds-scrim'

Scrim.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
}
