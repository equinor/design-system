import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { subtitleTypography } = tokens

const StyledDrawerLabel = styled.label`
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

type DrawerLabelType = HTMLAttributes<HTMLLabelElement>

export const DrawerLabel = forwardRef<HTMLLabelElement, DrawerLabelType>(
  function DrawerLabel({ children, ...props }, ref) {
    return (
      <StyledDrawerLabel {...props} ref={ref}>
        {children}
      </StyledDrawerLabel>
    )
  },
)
