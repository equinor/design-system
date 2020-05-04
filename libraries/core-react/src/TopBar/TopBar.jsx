import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { topbar as tokens } from './TopBar.tokens'

const {
  background,
  height,
  spacings,
  border,
  title: { text },
} = tokens

const StyledTopBar = styled.header`
  height: ${height};
  top: 0;
  position: sticky;
  background: ${background};
  box-sizing: border-box;
  z-index: 1000;
  display: grid;
  grid-column-gap: ${spacings.left};
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'left center right';
  align-items: center;
  border-bottom: ${border.bottom.width} solid ${border.bottom.color};

  ${spacingsTemplate(spacings)};
  ${typographyTemplate(text)}
`

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {React.ReactNode} [children]
 */

export const TopBar = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLElement>} props
   * @param ref
   */
  function EdsTopBar({ children, ...rest }, ref) {
    return (
      <StyledTopBar {...rest} ref={ref}>
        {children}
      </StyledTopBar>
    )
  },
)

TopBar.displayName = 'eds-topbar'

TopBar.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

TopBar.defaultProps = {
  className: '',
  children: undefined,
}
