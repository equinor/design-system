import React, { forwardRef, HTMLAttributes, Ref } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

type StyledDrawerContainer = {
  ref?: Ref<HTMLElement>
} & HTMLAttributes<HTMLElement>

const StyledDrawerContainer = styled.nav<StyledDrawerContainer>`
  background: ${background};
  width: 254px;
  height: 100%;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const DrawerContainer = forwardRef(function EdsDrawerContainer(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerContainer {...props} ref={ref}>
      {children}
    </StyledDrawerContainer>
  )
})
