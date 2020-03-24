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

  ${({ isDismissed }) =>
    isDismissed &&
    css`
      display: none;
      visibility: hidden;
    `}
`

export const Scrim = forwardRef(function EdsScrim(
  { children, isDismissable, ...rest },
  ref,
) {
  const [isDismissed, setIsDismissed] = useState(false)

  const dismissFunction = useCallback((event) => {
    if (event) {
      // console.log('Esc dismiss', event.key, isDismissable)
      if (event.key === 'Escape' && isDismissable) {
        setIsDismissed(true)
      }
    }
  }, [])

  // console.log('Is dismissed?', isDismissed)

  useEffect(() => {
    if (!isDismissed) {
      document.addEventListener('keydown', dismissFunction, false)
    }

    return () => {
      document.removeEventListener('keydown', dismissFunction, false)
    }
  }, [isDismissed])

  return (
    <StyledScrim
      isDismissable={isDismissable}
      isDismissed={isDismissed}
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
  isDismissable: PropTypes.bool,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
  isDismissable: true,
}
