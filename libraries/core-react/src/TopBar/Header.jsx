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

/**
 * @typedef {object} Props
 * @prop {React.ReactNode} [children]
 * @prop {string} [className]
 */

export const Header = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function EdsTopBarHeader({ children, ...rest }, ref) {
    return (
      <StyledHeader ref={ref} {...rest}>
        {children}
      </StyledHeader>
    )
  },
)

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
