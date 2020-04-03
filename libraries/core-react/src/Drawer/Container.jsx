import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { drawer as tokens } from './Drawer.tokens'

const { background, border } = tokens

const StyledContainer = styled.div`
  background: ${background.backgroundColor};
  width: 254px;
  border-right: ${border.right.width} solid ${border.right.color};
`

export const Container = forwardRef(function EdsDrawerContainer(
  { children, ...props },
  ref,
) {
  return (
    <StyledContainer {...props} ref={ref}>
      {children}
    </StyledContainer>
  )
})

Container.displayName = 'eds-drawer-container'

Container.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Container.defaultProps = {
  className: '',
  children: undefined,
}
