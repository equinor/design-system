import React, { forwardRef, useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'

const { height, width, background } = tokens

const StyledScrim = styled.div`
  width: ${width};
  height: ${height};
  background: ${background};
  position: fixed;
  z-index: 11;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  visibility: visible;
`

export const Scrim = forwardRef(function EdsScrim(
  { children, onClose, isDismissable, ...rest },
  ref,
) {
  const handleKeyPress = (event) => {
    if (event) {
      if (event.key === 'Escape' && isDismissable) {
        onClose(event, false)
      }
    }
  }

  useEffect(() => {
    if (isDismissable) {
      document.addEventListener('keydown', handleKeyPress, false)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress, false)
    }
  }, [])

  return (
    <StyledScrim
      onClose={handleKeyPress}
      isDismissable={isDismissable}
      {...rest}
      ref={ref}
    >
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
  /** Function to handle closing scrim */
  onClose: PropTypes.func,
  /** Whether scrim can be dismissed with esc key */
  isDismissable: PropTypes.bool,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
  onClose: () => {},
  isDismissable: false,
}
