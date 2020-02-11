import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'

import { topbar as tokens } from './TopBar.tokens'

const {
  title: { text },
} = tokens

const StyledHeader = styled.div`
  grid-area: left;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 24px;
  align-items: center;
  ${typographyTemplate(text)}
`

export const Header = forwardRef(function EdsTopBarHeader(
  { children, ...props },
  ref,
) {
  return (
    <StyledHeader ref={ref} {...props}>
      {children}
    </StyledHeader>
  )
})

Header.displayName = 'eds-topbar-header'

Header.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Header.defaultProps = {
  className: undefined,
  children: undefined,
}
