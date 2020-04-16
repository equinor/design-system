import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

const Anchor = styled.div`
  position: relative;
  display: inline-block;
  width: min-content;
  &:hover {
    > :last-child {
      display: block;
    }
  }

  /* > * div {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
    &:hover {
      visibility: visible;
    }
    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: black transparent transparent transparent;
    }
  } */
`

const StyledTooltip = styled.div`
  display: none;
  background: #333333;
  border-radius: 4px;
  position: absolute;
  z-index: 1;
  bottom: -40px;

  ::after {
    content: '';
  }

  ${spacingsTemplate(tokens.spacings)}
  ${typographyTemplate(tokens.typography)}
`

const TooltipArrow = styled.div`
  position: absolute;
  transform: rotate(45deg);
  width: 8px;
  height: 8px;
  background: #333333;
  border-top-left-radius: 2px;
  top: -4px;
`

export const Tooltip = forwardRef(function Tooltip(
  { className, title, children, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <Anchor>
      {children}
      <StyledTooltip>
        <TooltipArrow />
        {title}
      </StyledTooltip>
    </Anchor>
  )
})

Tooltip.displayName = 'eds-tooltip'

Tooltip.propTypes = {
  // Tooltip placement
  placement: PropTypes.oneOf([
    'topStart',
    'top',
    'topEnd',
    'rightStart',
    'right',
    'rightEnd',
    'bottomStart',
    'bottom',
    'bottomEnd',
    'leftStart',
    'left',
    'leftEnd',
  ]),
  // Tooltip title
  title: PropTypes.string,
  /** Tooltip reference element */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Tooltip.defaultProps = {
  placement: 'bottom',
  title: '',
  className: '',
}
