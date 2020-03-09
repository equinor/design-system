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
  focus,
  active: activeToken,
  hover,
} = tokens

const StyledChips = styled.div.attrs(({ disabled, clickable }) => ({
  tabIndex: disabled || !clickable ? null : 0,
}))`
  background: ${enabled.background};
  height: ${enabled.height};
  width: fit-content;
  display: grid;
  grid-gap: 8px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  border: ${focus.border.width} solid transparent;

  svg {
    fill: ${enabled.typography.color};
    height: ${enabled.icon.height};
    width: ${enabled.icon.width};
  }

  &:hover {
    color: ${hover.typography.color};
    svg {
      fill: ${hover.typography.color};
    }
  }

  ${bordersTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}

  ${({ active }) =>
    active &&
    css`
      background: ${activeToken.background};
    `}

  ${({ clickable }) =>
    clickable &&
    css`
      &:focus {
        outline: none;
        border-radius: ${focus.border.radius};
        border: ${focus.border.width} ${focus.border.type} ${focus.border.color};
      }
      &:hover {
        cursor: pointer;
      }
    `}

  ${({ deletable }) =>
    deletable &&
    css`
      padding-right: 4px;
    `}

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
`

export const Chip = forwardRef(function Chips(
  { className, children, onDelete, disabled, onClick, ...rest },
  ref,
) {
  const handleDelete = disabled ? () => null : onDelete
  const handleClick = disabled ? () => null : onClick

  const deletable = handleDelete !== null
  const clickable = handleClick !== null

  const props = {
    ...rest,
    disabled,
    onClick: handleClick,
    ref,
    className,
    deletable,
    clickable,
  }

  return (
    <StyledChips {...props}>
      {children}
      {onDelete && (
        <Icon
          name="close"
          disabled={disabled}
          onClick={() => handleDelete(props)}
        />
      )}
    </StyledChips>
  )
})

Chip.displayName = 'eds-chip'

Chip.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
  /** Disabled */
  disabled: PropTypes.bool,
  /** Active */
  active: PropTypes.bool,
  /** Delete callback */
  onDelete: PropTypes.func,
  /** Click callback */
  onClick: PropTypes.func,
}

Chip.defaultProps = {
  className: '',
  children: [],
  disabled: false,
  active: false,
  onDelete: null,
  onClick: null,
}
