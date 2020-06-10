import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon } from '..'
import { button } from './Button.tokens'
import { typographyTemplate } from '../_common/templates'

const { colors } = button
// TODO: Is there a better way to handle css properties without
// bloating with ${props => props.base.focus.color} etc...
const Base = ({ base, baseDisabled: disabled }) => {
  if (!base) {
    // TODO: What to do when base does not exist
    return ``
  }

  const { border, spacing, typography, focus, hover } = base

  return css`
    background: ${base.background};
    height: ${base.height};
    width: ${base.width};
    color: ${base.color};
    fill: ${base.color};
    svg {
      height: 16px;
      width: 16px;
    }

    border-radius: ${border.radius};
    border-color: ${border.color};
    border-width: ${border.width};

    ${spacing &&
    css`
      padding-left: ${spacing.left};
      padding-right: ${spacing.right};
    `}

    ${typographyTemplate(typography)}

    &::after {
      position: absolute;
      top: -${base.clickboundOffset};
      left: 0;
      width: 100%;
      height: ${base.clickbound};
      content: '';
    }

    &:hover {
      background: ${hover.background};
      ${hover.radius &&
      css`
        border-radius: ${hover.radius};
      `}
    }

    &:focus {
      outline: none;
    }

    &[data-focus-visible-added]:focus {
      outline: ${focus.width} ${focus.type} ${focus.color};
      outline-offset: 2px;
    }
    /* Get rid of ff focus border for buttons */
    &::-moz-focus-inner {
      border: 0;
    }

    &:disabled {
      cursor: not-allowed;
      background: ${disabled.background};
      color: ${disabled.color};
      fill: ${disabled.color};

      border-color: ${disabled.border.color};

      &:hover {
        background: ${disabled.background};
      }
    }
  `
}

const ButtonBase = styled.button.attrs(({ type = 'button' }) => ({
  type,
}))`
  margin: 0;
  padding: 0;
  ${Base}
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
  children: ({ children }) => {
    let error

    const iconChildIsMissingTitle = React.Children.toArray(children)
      .map(
        ({ type, props: childProps }) =>
          (type || { displayName: '' }).displayName === Icon.displayName &&
          !childProps.title,
      )
      .includes(true)

    if (iconChildIsMissingTitle) {
      error = new Error(
        `When using an Icon in the Button, the property "title" is mandatory on Icon to meet accessibility requirements`,
      )
    }
    return error
  },
  /**  Specifies color */
  color: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  /** Specifies which variant to use */
  variant: PropTypes.oneOf(['contained', 'outlined', 'ghost', 'ghost_icon']),

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
  children: null,
}

Button.displayName = 'eds-button'
