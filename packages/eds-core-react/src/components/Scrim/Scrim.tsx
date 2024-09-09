import { forwardRef, MouseEvent, HTMLAttributes, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import {
  useGlobalKeyPress,
  mergeRefs,
  useHideBodyScroll,
} from '@equinor/eds-utils'
import { FloatingOverlay } from '@floating-ui/react'

const { background } = tokens

const StyledScrim = styled(FloatingOverlay)`
  background: ${background};
  z-index: 1300;
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
  const scrimRef = useRef<HTMLDivElement>(null)
  useHideBodyScroll(open)

  const combinedScrimRef = useMemo(
    () => mergeRefs<HTMLDivElement>(scrimRef, ref),
    [scrimRef, ref],
  )

  useGlobalKeyPress('Escape', () => {
    if (isDismissable && onClose && open) {
      onClose()
    }
  })

  const handleMouseClose = (event: MouseEvent) => {
    if (event && event.target === scrimRef.current) {
      if (event.type === 'mousedown' && isDismissable && open) {
        onClose && onClose()
      }
    }
  }

  if (!open) {
    return null
  }

  return (
    <StyledScrim
      onMouseDown={handleMouseClose}
      ref={combinedScrimRef}
      {...rest}
    >
      <ScrimContent>{children}</ScrimContent>
    </StyledScrim>
  )
})
