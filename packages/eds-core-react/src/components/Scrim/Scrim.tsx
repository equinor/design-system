import { forwardRef, MouseEvent, HTMLAttributes, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import {
  useGlobalKeyPress,
  useHideBodyScroll,
  mergeRefs,
} from '@equinor/eds-utils'

const { height, width, background } = tokens

const StyledScrim = styled.div`
  width: ${width};
  height: ${height};
  background: ${background};
  position: fixed;
  z-index: 1300;
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
  const scrimRef = useRef<HTMLDivElement>(null)

  const combinedScrimRef = useMemo(
    () => mergeRefs<HTMLDivElement>(scrimRef, ref),
    [scrimRef, ref],
  )
  const props = {
    ...rest,
    open,
    isDismissable,
  }
  useHideBodyScroll(open)

  useGlobalKeyPress('Escape', () => {
    if (isDismissable && onClose && open) {
      onClose()
    }
  })

  const handleMouseClose = (event: MouseEvent) => {
    if (event && event.target === scrimRef.current) {
      if (event.type === 'click' && isDismissable && open) {
        onClose && onClose()
      }
    }
  }

  if (!open) {
    return null
  }

  return (
    <StyledScrim onClick={handleMouseClose} ref={combinedScrimRef} {...props}>
      <ScrimContent>{children}</ScrimContent>
    </StyledScrim>
  )
})
