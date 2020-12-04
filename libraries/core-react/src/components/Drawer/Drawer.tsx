import React, { forwardRef, HTMLAttributes, useEffect, ReactNode } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'
import { useDrawer } from './Drawer.context'
import { useCombinedRefs, useOutsideClick } from '@hooks'

const { background, border } = tokens

type DrawerContainerProps = HTMLAttributes<HTMLElement>

const StyledDrawerContainer = styled.nav<DrawerContainerProps>`
  background: ${background};
  margin-top: 16px;
  width: 254px;
  height: 100%;
  border-right: ${border.right.width} solid ${border.right.color};
`

const StyledDrawer = styled.div`
  background: none;
`

export type DrawerProps = {
  overlay?: boolean
  /** Is Menu open */
  focusedIndex?: number
  /** onClose handler */
  onClose?: (e?: React.MouseEvent<ReactNode, MouseEvent>) => void
} & HTMLAttributes<HTMLDivElement>

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { children, overlay = false, onClose: onCloseCallback, ...rest },
  ref,
) {
  const props = {
    ...rest,
    overlay,
  }
  const { setOnClose, onClose } = useDrawer()

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  })

  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        if (onClose !== null && onCloseCallback) {
          onClose
        }

        break
      default:
        break
    }
  }

  console.log(props)

  return (
    <StyledDrawer {...props} ref={ref}>
      <StyledDrawerContainer>{children}</StyledDrawerContainer>
    </StyledDrawer>
  )
})
