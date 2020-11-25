import React, { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, subtitleBorder, subtitleTypography } = tokens

type DrawerSubtitleProps = {
  /** Subtitle name */
  name?: string
} & HTMLAttributes<HTMLDivElement>

const StyledDrawerSubtitle = styled.div<DrawerSubtitleProps>`
  background: ${background};
  width: 100%;
  padding-top: 7px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: ${subtitleBorder.top.width} solid ${subtitleBorder.top.color};
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

export const DrawerSubtitle = forwardRef<HTMLDivElement, DrawerSubtitleProps>(
  function DrawerSubtitle({ children, name, ...props }, ref) {
    return (
      <StyledDrawerSubtitle {...props} name={name} ref={ref}>
        {name}
        {children}
      </StyledDrawerSubtitle>
    )
  },
)
