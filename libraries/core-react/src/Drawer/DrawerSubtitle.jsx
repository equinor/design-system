import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

const StyledDrawerSubtitle = styled.div`
  background: ${background.backgroundColor};
  width: 254px;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const DrawerSubtitle = forwardRef(function EdsDrawerSubtitle(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerSubtitle {...props} ref={ref}>
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
}

DrawerSubtitle.defaultProps = {
  className: '',
  children: undefined,
}
