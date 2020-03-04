import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledCustomContent = styled.div`
  grid-area: center;
`

/**
 * @typedef {object} Props
 * @prop {React.ReactNode} [children]
 * @prop {string} [className]
 */

export const CustomContent = forwardRef(
  /**
   * @param {Props} props
   * @param {React.Ref<any>} ref
   * @returns {React.ReactElement}
   */
  function EdsTopBarCustomContent({ children, ...rest }, ref) {
    return (
      <StyledCustomContent ref={ref} {...rest}>
        {children}
      </StyledCustomContent>
    )
  },
)

CustomContent.displayName = 'eds-topbar-customcontent'

CustomContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CustomContent.defaultProps = {
  className: undefined,
  children: undefined,
}
