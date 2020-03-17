import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
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
  display: none;
  visibility: hidden;
  /* display: flex;
  visibility: visible; */
  align-items: center;
  justify-content: center;

  ${({ isVisible }) =>
    isVisible &&
    css`
      display: flex;
      visibility: visible;
    `}
`

export const Scrim = forwardRef(function EdsScrim(
  { children, isVisible, ...props },
  ref,
) {
  console.log(isVisible)
  return (
    <StyledScrim isVisible={isVisible} {...props} ref={ref}>
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
  isVisible: PropTypes.bool,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
  isVisible: false,
}
