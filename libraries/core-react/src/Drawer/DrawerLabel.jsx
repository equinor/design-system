import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { subtitleTypography } = tokens

const StyledDrawerLabel = styled.label`
  font-size: ${subtitleTypography.fontSize};
  font-weight: ${subtitleTypography.fontWeight};
  line-height: ${subtitleTypography.lineHeight};
`

export const DrawerLabel = forwardRef(function EdsDrawerLabel(
  { children, ...props },
  ref,
) {
  return (
    <StyledDrawerLabel {...props} ref={ref}>
      {children}
    </StyledDrawerLabel>
  )
})

DrawerLabel.displayName = 'eds-drawer-label'

DrawerLabel.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

DrawerLabel.defaultProps = {
  className: '',
  children: undefined,
}
