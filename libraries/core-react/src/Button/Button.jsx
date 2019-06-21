import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import primaryButtonTokens from '../../../../common/desktop-ui/buttons-primary.json'
import secondaryButtonTokens from '../../../../common/desktop-ui/buttons-secondary.json'
import dangerButtonTokens from '../../../../common/desktop-ui/buttons-danger.json'
import disabledButtonTokens from '../../../../common/desktop-ui/buttons-disabled.json'

const colors = {
  primary: primaryButtonTokens,
  secondary: secondaryButtonTokens,
  danger: dangerButtonTokens,
  disabled: disabledButtonTokens,
}

// TODO: Is there a better way to handle css properties without
// bloating with ${props => props.base.focus.color} etc...
// Using simple template string for now, but missing css syntax highlight :(
const Base = ({ base, baseDisabled: disabled }) => {
  if (!base) {
    // TODO: What to do when base does not exist
    return ``
  }

  const { border, spacing, typography, focus } = base

  return `
    height: ${base.height}px;
    background: ${base.background};
    color: ${base.color};

    border-radius: ${border.radius}px;
    border-color: ${border.color};
    border-width: ${border.width}px;

    padding-left: ${spacing.left}px;
    padding-right: ${spacing.right}px;

    font-family: ${typography.font};
    font-size: ${typography.fontSize}px;
    font-weight: ${typography.fontWeight};
    line-height: ${typography.lineHeight}px;
    letter-spacing: ${typography.letterSpacing}px;

    &::after {
      position: absolute;
      top:-6px;
      left:0;
      width: 100%;
      height: ${base.clickbound}px;
      content: '';
    }

    &:hover {
      background: ${base.hoverBackground};
    }

    &:focus {
      outline-offset: ${focus.width}px;
      outline: ${focus.width}px ${focus.type} ${focus.color};
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabled.background};
      color: ${disabled.color};

      border-radius: ${disabled.border.radius}px;
      border-color: ${disabled.border.color};
      border-width: ${disabled.border.width}px;

      font-family: ${disabled.typography.font};
      font-size: ${disabled.typography.fontSize}px;
      font-weight: ${disabled.typography.fontWeight};
      line-height: ${disabled.typography.lineHeight}px;
      letter-spacing: ${disabled.typography.letterSpacing}px;

      &:hover {
        background: ${disabled.background};
      }
    }
`
}

const ButtonBase = styled.button.attrs(() => ({
  type: 'button',
  aria: 'button',
}))`
  ${Base}
  position:relative;
  cursor: pointer;
  text-align: center;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: auto;
    min-height: auto;
    content: '';
  }
`

// TODO:
// - Missing top spacing
// - Fallback color?
// - Use ThemeProvider
// - Set attr on button

const Button = ({ variant, children, disabled, className, color }) => {
  const colorBase = colors[color] || {}
  const base = colorBase[variant] || {}
  const baseDisabled = colors.disabled[variant] || {}

  return (
    <ButtonBase
      base={base}
      baseDisabled={baseDisabled}
      className={className}
      disabled={disabled}
    >
      {children}
    </ButtonBase>
  )
}

Button.propTypes = {
  /** @ignore */
  children: PropTypes.node.isRequired,
  /**  Specifies color */
  color: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(['contained', 'outlined', 'ghost']),
  /**
   * If `true`, the button will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  className: PropTypes.string,
}

Button.defaultProps = {
  variant: 'contained',
  color: 'primary',
  disabled: false,
  className: '',
}

Button.displayName = 'eds-button'

export default Button
