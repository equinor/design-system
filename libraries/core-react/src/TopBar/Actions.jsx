import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledActions = styled.div`
  grid-area: right;
  text-align: right;
`

/**
 * @typedef {object} Props
 * @prop {React.ReactNode} [children]
 * @prop {string} [className]
 */

export const Actions = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function EdsTopBarActions({ children, ...rest }, ref) {
    return (
      <StyledActions ref={ref} {...rest}>
        {children}
      </StyledActions>
    )
  },
)

Actions.displayName = 'eds-topbar-actions'

Actions.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Actions.defaultProps = {
  className: undefined,
  children: undefined,
}
