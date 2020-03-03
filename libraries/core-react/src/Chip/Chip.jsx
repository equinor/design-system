import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { chips as tokens } from './Chip.tokens'
import {
  bordersTemplate,
  spacingsTemplate,
  typographyTemplate,
} from '../_common/templates'

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

const StyledChips = styled.div.attrs(({ disabled }) => ({
  tabIndex: disabled ? null : 0,
}))`
  background: ${({ active }) =>
    active ? activeToken.background : enabled.background};
  height: ${enabled.height};
  display:grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, auto);
  align-items:center;
  border: ${focus.border.width} solid transparent;

  svg {
    fill: ${enabled.typography.color};
    height: 16px;
    width: 16px;
  }

  ${bordersTemplate(enabled.border)}
  ${spacingsTemplate(enabled.spacings)}
  ${typographyTemplate(enabled.typography)}
  ${disabledOverrides}

  &:focus {
    outline:none;
    border-radius: ${focus.border.radius};
    border: ${focus.border.width} ${focus.border.type} ${focus.border.color};
  }

  &:hover {
    cursor:pointer;
  }
`

export const Chip = forwardRef(function Chips(
  { className, children, ...props },
  ref,
) {
  return (
    <StyledChips {...props} className={className} ref={ref}>
      {children}
    </StyledChips>
  )
})

Chip.displayName = 'eds-chip'

Chip.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Chip.defaultProps = {
  className: '',
  children: [],
}
