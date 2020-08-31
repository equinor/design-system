// @ts-nocheck
import React, { forwardRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
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
`

const ScrimContent = styled.div`
  width: auto;
  height: auto;
`

export const Scrim = forwardRef(function EdsScrim(
  { children, onClose, isDismissable, ...rest },
  ref,
) {
  const handleClose = (event) => {
    if (event) {
      if (event.key === 'Escape' && isDismissable) {
        onClose(event, false)
      } else if (event.type === 'click' && isDismissable) {
        onClose(event, false)
      }
    }
  }

  const handleContentClick = (event) => {
    // Avoid event bubbling inside dialog/content inside scrim
    event.stopPropagation()
  }

  useEffect(() => {
    if (isDismissable) {
      document.addEventListener('keydown', handleClose, false)
    }

    return () => {
      document.removeEventListener('keydown', handleClose, false)
    }
  }, [])

  return (
    <StyledScrim
      onClose={handleClose}
      onClick={handleClose}
      isDismissable={isDismissable}
      {...rest}
      ref={ref}
    >
      <ScrimContent onClick={handleContentClick}>{children}</ScrimContent>
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
