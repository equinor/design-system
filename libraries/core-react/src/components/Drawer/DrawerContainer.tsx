import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

type DrawerContainerProps = HTMLAttributes<HTMLElement>

const StyledDrawerContainer = styled.nav<DrawerContainerProps>`
  background: ${background};
  width: 254px;
  height: 100%;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const DrawerContainer = forwardRef<HTMLElement, DrawerContainerProps>(
  function DrawerContainer({ children, ...props }, ref) {
    return (
      <StyledDrawerContainer {...props} ref={ref}>
        {children}
      </StyledDrawerContainer>
    )
  },
)
