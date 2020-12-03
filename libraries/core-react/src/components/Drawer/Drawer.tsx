import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

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
} & HTMLAttributes<HTMLDivElement>

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { children, overlay = false, ...rest },
  ref,
) {
  const props = {
    ...rest,
    overlay,
  }

  return (
    <StyledDrawer {...props} ref={ref}>
      <StyledDrawerContainer>{children}</StyledDrawerContainer>
    </StyledDrawer>
  )
})
