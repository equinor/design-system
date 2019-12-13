import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import primaryButtonTokens from '@equinor/eds-tokens/components/button/buttons-primary.json'
import secondaryButtonTokens from '@equinor/eds-tokens/components/button/buttons-secondary.json'
import dangerButtonTokens from '@equinor/eds-tokens/components/button/buttons-danger.json'
import disabledButtonTokens from '@equinor/eds-tokens/components/button/buttons-disabled.json'
import { typographyTemplate } from '../_common/templates'

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
    height: ${base.height};
    background: ${base.background};
    color: ${base.color};

    border-radius: ${border.radius};
    border-color: ${border.color};
    border-width: ${border.width};

    padding-left: ${spacing.left};
    padding-right: ${spacing.right};

    ${typographyTemplate(typography)}

    &::after {
      position: absolute;
      top:-${base.clickboundOffset};
      left:0;
      width: 100%;
      height: ${base.clickbound};
      content: '';
    }

    &:hover {
      background: ${base.hoverBackground};
    }

    &:focus {
      outline-offset: ${focus.width};
      outline: ${focus.width} ${focus.type} ${focus.color};
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabled.background};
      color: ${disabled.color};

      border-color: ${disabled.border.color};

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
  margin: 0;
  padding: 0;
  ${Base}
  position: relative;
  cursor: pointer;
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

export const Button = ({
  variant,
  children,
  disabled,
  className,
  color,
  ...other
}) => {
  const colorBase = colors[color] || {}
  const base = colorBase[variant] || {}
  const baseDisabled = colors.disabled[variant] || {}

  return (
    <ButtonBase
      base={base}
      baseDisabled={baseDisabled}
      className={className}
      disabled={disabled}
      {...other}
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
