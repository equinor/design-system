import React, {
  forwardRef,
  useEffect,
  useCallback,
  useState,
  useRef,
} from 'react'
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
  display: none;
  visibility: hidden;

  ${({ isVisible }) =>
    isVisible &&
    css`
      display: flex;
      visibility: visible;
    `}
`

export const Scrim = forwardRef(function EdsScrim(
  { children, isVisible, isDismissable, ...rest },
  ref,
) {
  const [visibleScrim, setVisibleScrim] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [hasToggledBefore, setHasToggledBefore] = useState(false)
  const isScrimVisibleRef = useRef(visibleScrim)
  isScrimVisibleRef.current = visibleScrim
  let timeoutTrick

  function toggle() {
    timeoutTrick = setTimeout(() => {
      setVisibleScrim(!isScrimVisibleRef.current)

      clearTimeout(timeoutTrick)
    }, 10)
    setHasToggledBefore(true)
  }

  const dismissFunction = useCallback((event) => {
    if (event) {
      console.log('Esc dismiss', event.key, isDismissable)
      if (event.key === 'Escape' && isDismissable) {
        setIsDismissed(true)
        toggle()
      }
    }
  }, [])

  useEffect(() => {
    if (isVisible && !visibleScrim) {
      toggle()
    }
    if (!isVisible && visibleScrim) {
      toggle()
    }
    if (isVisible && visibleScrim) {
      document.addEventListener('keydown', dismissFunction, false)
    }
    return () => {
      document.removeEventListener('keydown', dismissFunction, false)
    }
    // if visibleScrim and dismissed false
  }, [isVisible, visibleScrim, isDismissed, hasToggledBefore])

  return (
    <StyledScrim
      isVisible={visibleScrim}
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
  isVisible: PropTypes.bool,
  isDismissable: PropTypes.bool,
}

Scrim.defaultProps = {
  className: '',
  children: undefined,
  isVisible: false,
  isDismissable: true,
}
