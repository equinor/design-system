import { forwardRef, MouseEvent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { useGlobalKeyPress, useHideBodyScroll } from '../../hooks'

const { height, width, background } = tokens

const StyledScrim = styled.div`
  width: ${width};
  height: ${height};
  background: ${background};
  position: fixed;
  z-index: 500;
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

export type ScrimProps = {
  /** Whether scrim can be dismissed with esc key and outside click
   */
  isDismissable?: boolean
  /** function to handle closing scrim */
  onClose?: (event: MouseEvent | KeyboardEvent, open: boolean) => void
} & HTMLAttributes<HTMLDivElement>

export const Scrim = forwardRef<HTMLDivElement, ScrimProps>(function Scrim(
  { children, onClose, isDismissable = false, ...rest },
  ref,
) {
  const props = {
    ...rest,
    isDismissable,
    ref,
  }

  const overflowState = document.body.style.overflow
  useHideBodyScroll(overflowState)

  useGlobalKeyPress('Escape', (e: KeyboardEvent) => {
    if (isDismissable && onClose) {
      onClose(e, false)
    }
  })

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

  return (
    <StyledScrim onClick={handleMouseClose} {...props}>
      <ScrimContent onClick={handleContentClick}>{children}</ScrimContent>
    </StyledScrim>
  )
})
