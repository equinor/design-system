import { forwardRef, MouseEvent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { useGlobalKeyPress, useHideBodyScroll } from '@equinor/eds-utils'

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
  /** programmatically toggle scrim */
  open: boolean
  /** function to handle closing scrim */
  onClose?: () => void
} & HTMLAttributes<HTMLDivElement>

export const Scrim = forwardRef<HTMLDivElement, ScrimProps>(function Scrim(
  { children, onClose, open, isDismissable = false, ...rest },
  ref,
) {
  const props = {
    ...rest,
    open,
    isDismissable,
    ref,
  }

  useHideBodyScroll(open)

  useGlobalKeyPress('Escape', () => {
    if (isDismissable && onClose && open) {
      onClose()
    }
  })

  const handleMouseClose = (event: MouseEvent) => {
    if (event) {
      if (event.type === 'click' && isDismissable && open) {
        onClose && onClose()
      }
    }
  }

  const handleContentClick = (event: MouseEvent) => {
    // Avoid event bubbling inside dialog/content inside scrim
    event.stopPropagation()
  }

  if (!open) {
    return null
  }

  return (
    <StyledScrim onClick={handleMouseClose} {...props}>
      <ScrimContent onClick={handleContentClick}>{children}</ScrimContent>
    </StyledScrim>
  )
})
