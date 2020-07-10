import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon } from '..'
import { button } from './Button.tokens'
import { typographyTemplate } from '../_common/templates'

const { colors } = button

// display:grid; does not work on Webkit browser engine, so we have to wrap content in element where css-grid works
const ButtonInner = styled.span`
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  align-items: center;
`

const Base = ({ base, baseDisabled: disabled }) => {
  const { border, spacing, typography, focus, hover } = base

  return css`
    background: ${base.background};
    height: ${base.height};
    width: ${base.width};
    color: ${base.color};
    fill: ${base.color};
    svg {
      justify-self: center;
      height: ${button.icon_size.height};
      width: ${button.icon_size.width};
    }

    border-radius: ${border.radius};
    border-color: ${border.color};
    border-width: ${border.width};
    border-style: solid;

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

const ButtonBase = styled.button`
  margin: 0;
  padding: 0;
  ${Base}
  text-decoration: none;
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

export const Button = forwardRef(function Button(
  { variant, children, disabled, className, color, tabIndex, href, ...other },
  ref,
) {
  const colorBase = colors[color] || {}
  const base = colorBase[variant] || {}
  const baseDisabled = colors.disabled[variant] || {}

  const as = href ? 'a' : other.as ? other.as : 'button'

  const baseProps = {
    ...other,
    ref,
    as,
    href,
  }

  return (
    <ButtonBase
      base={base}
      type={href || other.as ? undefined : 'button'}
      baseDisabled={baseDisabled}
      className={className}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      {...baseProps}
    >
      <ButtonInner>{children}</ButtonInner>
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
  /**
   * If `true`, the button will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * URL link destination
   * If defined, an 'a' element is used as root instead of 'button'
   */
  href: PropTypes.string,
  /* User to control tabindex, default tabindex needed for button as span */
  tabIndex: PropTypes.number,
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
  href: undefined,
  tabIndex: 0,
}

Button.displayName = 'eds-button'
