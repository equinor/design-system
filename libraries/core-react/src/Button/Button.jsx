import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import buttonTokens from '../../../../common/desktop-ui/buttons-primary.json'

const { contained } = buttonTokens

const Button = styled.button`
  background: ${contained.background};
  color: ${contained.color || '#fff'};
  border-radius: ${contained.cornerRadius}px;
  padding: 10px ${contained.spacing}px;
  font-family: ${contained.typography.font};
  font-size: ${contained.typography.fontSize}px;
  font-weight: ${contained.typography.fontWeight};
  line-height: ${contained.typography.lineHeight}px;
  cursor: pointer;
  &::before {
    height: ${contained.clickbound}px;
  }
`

// TODO:
// - Missing top spacing
// - Fallback color?
// - Use ThemeProvider
// - Set attr on button

const getBackground = ({ variant }) => {
  if (variant === 'secondary') {
    return 'green;'
  }
  return 'red'
}

Button.propTypes = {
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(['primary', 'secondary']),
}

Button.defaultProps = {
  variant: 'primary',
}

Button.displayName = 'eds-button'

export default Button
