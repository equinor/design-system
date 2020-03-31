import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { menu as tokens } from './Menu.tokens'

const StyledMenu = styled.div``

export const Menu = React.forwardRef(function EdsMenu(props, ref) {
  return <StyledMenu {...props} ref={ref} />
})

StyledMenu.propTypes = {
  /** @ignore */
  className: PropTypes.string,
}

StyledMenu.defaultProps = {
  className: '',
}

StyledMenu.displayName = 'eds-menu'
