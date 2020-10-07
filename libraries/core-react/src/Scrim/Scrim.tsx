import React, { forwardRef, useEffect, MouseEvent } from 'react'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'

const { height, width, background } = tokens

type StyledScrimProps = {
  onClick: (event: MouseEvent, open: boolean) => void
  isDismissable?: boolean
}

const StyledScrim = styled.div<StyledScrimProps>`
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

type Props = {
  /** Whether scrim can be dismissed with esc key */
  isDismissable?: boolean
  /** function to handle closing scrim */
  onClose?: (event: MouseEvent | KeyboardEvent, open: boolean) => void
} & React.HTMLAttributes<HTMLElement>

export const Scrim = forwardRef<HTMLDivElement, Props>(function EdsScrim(
  { children, onClose, isDismissable = false, ...rest },
  ref,
) {
  const handleKeyboardClose = (event: KeyboardEvent) => {
    if (event) {
      if (event.key === 'Escape' && isDismissable) {
        onClose && onClose(event, false)
      }
    }
  }

  const handleMouseClose = (event: MouseEvent) => {
    if (event) {
      if (event.type === 'click' && isDismissable) {
        onClose && onClose(event, false)
      }
    }
  }

  const handleContentClick = (event: MouseEvent) => {
    // Avoid event bubbling inside dialog/content inside scrim
    event.stopPropagation()
  }

  useEffect(() => {
    if (isDismissable) {
      document.addEventListener('keydown', handleKeyboardClose, false)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboardClose, false)
    }
  }, [])

  return (
    <StyledScrim
      onClick={handleMouseClose}
      isDismissable={isDismissable}
      {...rest}
      ref={ref}
    >
      <ScrimContent onClick={handleContentClick}>{children}</ScrimContent>
    </StyledScrim>
  )
})

Scrim.displayName = 'Scrim'
