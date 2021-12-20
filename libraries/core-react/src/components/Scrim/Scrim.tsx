import { forwardRef, MouseEvent, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { useGlobalKeyPress, useHideBodyScroll } from '../../hooks'

const { height, width, background } = tokens

const StyledScrim = styled.div<StyledScrimProps>`
  width: ${width};
  height: ${height};
  background: ${background};
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  ${({ open }) => css({ display: open ? 'flex' : 'none' })}
`

const ScrimContent = styled.div`
  width: auto;
  height: auto;
`

type StyledScrimProps = Pick<ScrimProps, 'open'>

export type ScrimProps = {
  /** Whether scrim can be dismissed with esc key and outside click
   */
  isDismissable?: boolean
  /** programmatically toggle scrim */
  open: boolean
  /** function to handle closing scrim */
  onClose?: (event: MouseEvent | KeyboardEvent) => void
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

  useGlobalKeyPress('Escape', (e: KeyboardEvent) => {
    if (isDismissable && onClose && open) {
      onClose(e)
    }
  })

  const handleMouseClose = (event: MouseEvent) => {
    if (event) {
      if (event.type === 'click' && isDismissable && open) {
        onClose && onClose(event)
      }
    }
  }

  const handleContentClick = (event: MouseEvent) => {
    // Avoid event bubbling inside dialog/content inside scrim
    event.stopPropagation()
  }

  return (
    <StyledScrim onClick={handleMouseClose} {...props}>
      {open && (
        <ScrimContent onClick={handleContentClick}>{children}</ScrimContent>
      )}
    </StyledScrim>
  )
})
