import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'

const { height, width, background, position, zIndex } = tokens

const StyledScrim = styled.div.attrs(({ isVisible }) => ({
  tabIndex: isVisible ? 0 : null,
}))`
  width: ${width};
  height: ${height};
  background: ${background};
  position: ${position};
  z-index: ${zIndex};
  top: 0;
  left: 0;
  /* display: none;
  visibility: hidden; */
  display: flex;
  visibility: visible;
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
  { children, isVisible, onTriggerModal, ...props },
  ref,
) {
  const handleVisibility = onTriggerModal

  const handleKeyPress = (event) => {
    console.log(event)
    const { key } = event
    if (key === 'Esc') {
      handleVisibility(event)
    }
  }

  return (
    <StyledScrim {...props} ref={ref} onKeyPress={handleKeyPress}>
      {isVisible && children}
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
  onTriggerModal: PropTypes.func,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
  isVisible: false,
  onTriggerModal: undefined,
}
