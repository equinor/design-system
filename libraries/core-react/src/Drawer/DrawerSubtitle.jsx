import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, subtitleBorder, subtitleTypography } = tokens

const StyledDrawerSubtitle = styled.div`
  background: ${background.backgroundColor};
  width: 100%;
  padding-top: 7px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: ${subtitleBorder.top.width} solid ${subtitleBorder.top.color};
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

export const DrawerSubtitle = forwardRef(function EdsDrawerSubtitle(
  { children, name, ...props },
  ref,
) {
  return (
    <StyledDrawerSubtitle {...props} name={name} ref={ref}>
      {name}
      {children}
    </StyledDrawerSubtitle>
  )
})

DrawerSubtitle.displayName = 'eds-drawer-subtitle'

DrawerSubtitle.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Subtitle name */
  name: PropTypes.string,
}

DrawerSubtitle.defaultProps = {
  className: '',
  children: undefined,
  name: undefined,
}
