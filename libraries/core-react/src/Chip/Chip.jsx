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

const StyledChips = styled.div.attrs(({ clickable, deletable }) => ({
  tabIndex: clickable || deletable ? 0 : null,
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

  ${bordersTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}

  ${({ active }) =>
    active &&
    css`
      background: ${activeToken.background};
    `}

  ${({ clickable, deletable }) =>
    (clickable || deletable) &&
    css`
      &:focus {
        outline: none;
        border-radius: ${focus.border.radius};
        border: ${focus.border.width} ${focus.border.type} ${focus.border.color};
      }
    `}

    ${({ clickable }) =>
      clickable &&
      css`
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
  const handleDelete = disabled ? undefined : onDelete
  const handleClick = disabled ? undefined : onClick

  const deletable = handleDelete !== undefined
  const clickable = handleClick !== undefined

  const props = {
    ...rest,
    disabled,
    ref,
    className,
    deletable,
    clickable,
  }

  const handleKeyPress = (event) => {
    const { key } = event
    if (key === 'Enter') {
      if (deletable) {
        handleDelete(props)
      }
      // Delete takes presidens, else click action is activated
      if (clickable && !deletable) {
        handleClick(props)
      }
    }
  }

  const resizedChildren = React.Children.map(children, (child) => {
    // We force size on Icon & Avatar component
    if (child.props && child.props.size) {
      return React.cloneElement(child, { size: 16 })
    }

    return child
  })

  return (
    <StyledChips
      {...props}
      onClick={() => clickable && handleClick(props)}
      onKeyPress={handleKeyPress}
    >
      {resizedChildren}
      {onDelete && (
        <Icon
          name="close"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            if (deletable) {
              handleDelete(props)
            }
          }}
          size={16}
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
  onDelete: undefined,
  onClick: undefined,
}
