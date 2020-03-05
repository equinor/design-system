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

const { enabled, disabled: disabledToken, focus, active: activeToken } = tokens

const disabledOverrides = ({ disabled }) =>
  disabled &&
  css`
    cursor: not-allowed;
    color: ${disabledToken.typography.color};
    svg {
      fill: ${disabledToken.typography.color};
    }
  `

const StyledChips = styled.div.attrs(({ disabled, clickable }) => ({
  tabIndex: disabled || !clickable ? null : 0,
}))`
  background: ${({ active }) =>
    active ? activeToken.background : enabled.background};
  height: ${enabled.height};
  display:grid;
  grid-gap: 8px;
  grid-template-columns: repeat(3, auto);
  align-items:center;
  border: ${focus.border.width} solid transparent;

  svg {
    fill: ${enabled.typography.color};
    height: ${enabled.icon.height};
    width: ${enabled.icon.width};
  }

  &:focus {
    ${({ clickable }) =>
      clickable &&
      css`
        outline: none;
        border-radius: ${focus.border.radius};
        border: ${focus.border.width} ${focus.border.type} ${focus.border.color};
      `}
  }

  &:hover {
    ${({ clickable }) =>
      clickable &&
      css`
        cursor: pointer;
      `}
  }

  ${bordersTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}
  ${disabledOverrides}
`

export const Chip = forwardRef(function Chips(
  { className, children, onDelete, disabled, ...rest },
  ref,
) {
  const props = {
    ...rest,
    disabled,
  }
  const onClick = disabled ? () => undefined : onDelete
  return (
    <StyledChips {...props} className={className} ref={ref}>
      {children}
      {onDelete && (
        <Icon name="close" disabled={disabled} onClick={() => onClick(props)} />
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
  /** Clickable */
  clickable: PropTypes.bool,
}

Chip.defaultProps = {
  className: '',
  children: [],
  disabled: false,
  active: false,
  onDelete: null,
  clickable: false,
}
