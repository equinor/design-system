import React, { forwardRef } from 'react'
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
      ${({ height }) => css({ height })}
      ${({ width }) => css({ width })}
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

const RightIcon = styled.span`
  margin-left: 12px;
  line-height: normal;
`

const LeftIcon = styled.span`
  margin-right: 12px;
  line-height: normal;
`
// TODO:
// - Missing top spacing
// - Fallback color?
// - Use ThemeProvider
// - Set attr on button

export const Button = forwardRef(function Button(
  {
    variant,
    children,
    disabled,
    className,
    color,
    rightIcon,
    leftIcon,
    ...other
  },
  ref,
) {
  const colorBase = colors[color] || {}
  const base = colorBase[variant] || {}
  const baseDisabled = colors.disabled[variant] || {}

  const iconRight = rightIcon && <RightIcon>{rightIcon}</RightIcon>

  const iconLeft = leftIcon && <LeftIcon>{leftIcon}</LeftIcon>

  const iconType = variant === 'ghost_icon' ? variant : 'button_icon'

  const baseProps = {
    ...other,
    ref,
    width: button.icon_size[iconType].width,
    height: button.icon_size[iconType].height,
  }

  return (
    <ButtonBase
      base={base}
      baseDisabled={baseDisabled}
      className={className}
      disabled={disabled}
      {...baseProps}
    >
      {iconLeft}
      {children}
      {iconRight}
    </ButtonBase>
  )
})

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
  /** Icon to be displayed on the left side */
  leftIcon: PropTypes.node,
  /** Icon to be displayed on the right side */
  rightIcon: PropTypes.node,
  /**
   * If `true`, the button will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * URL link destination
   * If defined, an 'a' element is used as root
   */
  href: PropTypes.string,
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
  leftIcon: null,
  rightIcon: null,
  href: '',
}

Button.displayName = 'eds-button'
