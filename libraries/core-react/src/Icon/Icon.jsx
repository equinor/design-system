import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledIcon = styled.svg``

export const Icon = forwardRef(function Icon(
  { size, color, name, className },
  ref,
) {
  const props = {
    height: size,
    width: size,
    fill: color,
    className,
  }

  return <StyledIcon {...props} ref={ref} />
})

Icon.displayName = 'eds-icon'

Icon.propTypes = {
  // Valid colors
  color: PropTypes.string,
  // Vertical spacing
  size: PropTypes.oneOf([8, 16, 24, 32, 48]),
  // Name
  name: PropTypes.string,
  /** @ignore */
  className: PropTypes.string,
}

Icon.defaultProps = {
  color: 'medium',
  name: '',
  className: '',
  size: 24,
}
