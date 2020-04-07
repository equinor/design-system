import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { close } from '@equinor/eds-icons'
import { Icon } from './Icon'
import { chip as tokens } from './Chip.tokens'
import {
  bordersTemplate,
  spacingsTemplate,
  typographyTemplate,
} from '../_common/templates'

Icon.add({ close })

const {
  enabled,
  disabled: disabledToken,
  active: activeToken,
  hover,
  error,
  outline,
  outlineOffset,
} = tokens

const StyledChips = styled.div.attrs(({ clickable, deletable }) => ({
  tabIndex: clickable || deletable ? 0 : null,
  role: clickable ? 'button' : null,
}))`
  background: ${enabled.background};
  height: ${enabled.height};
  width: fit-content;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  z-index: 999;

  svg {
    fill: ${enabled.typography.color};
  }

  &:hover {
    color: ${hover.typography.color};
    svg {
      fill: ${hover.typography.color};
    }
  }

  &:focus {
    outline: none;
  }

  &[data-focus-visible-added]:focus {
    outline: ${outline};
    outline-offset: ${outlineOffset};
  }

  ${bordersTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}


  ${({ clickable }) =>
    clickable &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

    ${({ variant }) => {
      switch (variant) {
        case 'active':
          return css`
            background: ${activeToken.background};
          `
        case 'error':
          return css`
            background: ${error.background};
            border-color: ${error.border.color};
            border-width: ${error.border.width};
            border-style: ${error.border.type};
            color: ${error.typography.color};
            svg {
              fill: ${error.icon.color};
            }

            &:hover {
              border-color: ${error.hover.color};
              color: ${error.hover.color};
              svg {
                fill: ${error.hover.color};
              }
            }
          `
        default:
          return ''
      }
    }}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      background: ${enabled.background};
      color: ${disabledToken.typography.color};
      svg {
        fill: ${disabledToken.typography.color};
      }
      &:hover {
        color: ${disabledToken.typography.color};
        cursor: not-allowed;
        svg {
          fill: ${disabledToken.typography.color};
        }
      }
    `}

  ${({ deletable }) =>
    deletable &&
    css`
      padding-right: 4px;
    `}

  ${({ onlyChild }) =>
    onlyChild &&
    css`
      padding-left: 8px;
    `}

`

/**
 * @typedef Props
 * @prop {string} [className]
 * @prop {React.ReactNode} [children]
 * @prop {boolean} [disabled] Disabled
 * @prop {(event: React.KeyboardEvent | React.MouseEvent) => void} [onDelete] Delete callback
 * @prop {(event: React.KeyboardEvent | React.MouseEvent) => void} [onClick] Click callback
 * @prop {'active' | 'error' | 'default'} [variant] Variant
 */

export const Chip = forwardRef(
  /**
   * @param {Props} props
   * @param ref
   */
  function EdsChips(
    { children, onDelete, disabled, onClick, variant, ...rest },
    ref,
  ) {
    const handleDelete = disabled ? undefined : onDelete
    const handleClick = disabled ? undefined : onClick

    const deletable = handleDelete !== undefined
    const clickable = handleClick !== undefined
    const onlyChild = typeof children === 'string'

    const props = {
      ...rest,
      ref,
      disabled,
      deletable,
      clickable,
      onlyChild,
      variant,
    }

    const handleKeyPress = (event) => {
      const { key } = event
      if (key === 'Enter') {
        if (deletable) {
          handleDelete(event)
        }
        // Delete takes presidens, else click action is activated
        if (clickable && !deletable) {
          handleClick(event)
        }
      }
    }

    const resizedChildren = React.Children.map(children, (child) => {
      // We force size on Icon & Avatar component
      // @ts-ignore
      if (child.props && child.props.size) {
        // @ts-ignore
        return React.cloneElement(child, {
          size: 16,
          disabled,
        })
      }
      return child
    })

    return (
      <StyledChips
        {...props}
        onClick={(event) => clickable && handleClick(event)}
        onKeyPress={handleKeyPress}
      >
        {resizedChildren}
        {onDelete && (
          <Icon
            name="close"
            title="close"
            disabled={disabled}
            variant={variant}
            onClick={(event) => {
              event.stopPropagation()
              if (deletable) {
                handleDelete(event)
              }
            }}
            size={16}
          />
        )}
      </StyledChips>
    )
  },
)

Chip.displayName = 'eds-chip'

Chip.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Disabled */
  disabled: PropTypes.bool,
  /** Delete callback */
  onDelete: PropTypes.func,
  /** Click callback */
  onClick: PropTypes.func,
  /** Variant */
  // @ts-ignore
  variant: PropTypes.oneOf(['active', 'error', 'default']),
}

Chip.defaultProps = {
  className: '',
  children: [],
  disabled: false,
  onDelete: undefined,
  onClick: undefined,
  // @ts-ignore
  variant: 'default',
}
