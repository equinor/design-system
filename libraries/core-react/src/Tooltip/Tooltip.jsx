import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

const Anchor = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
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

const StyledTooltipWrapper = styled.div`
  display: none;
  position: absolute;
  width: ${({ width }) => width};
  z-index: 1;
  top: ${({ top }) => top};
  bottom: ${({ bottom }) => bottom};
  max-width: 300px;
  right: ${({ right }) => right};
  left: ${({ left }) => left};
  transform: ${({ transform }) => transform};
  ::after {
    content: '';
  }
`

const StyledTooltip = styled.div`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  background: #333333;
  border-radius: 4px;
  width: min-content;
  display: table;
  margin: ${({ margin }) => margin};
  position: relative;
`

const TooltipArrow = styled.div`
  position: absolute;
  transform: rotate(45deg);
  width: 8px;
  height: 8px;
  background: #333333;
  border-top-left-radius: 2px;
  left: ${({ left }) => left};
  right: ${({ right }) => right};
  top: ${({ top }) => top};
  bottom: ${({ bottom }) => bottom};
`

export const Tooltip = forwardRef(function Tooltip(
  { className, title, children, placement, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  const wrapperProps = {
    right: tokens.placement[placement].tooltipRight,
    width: tokens.placement[placement].width,
    top: tokens.placement[placement].tooltipTop,
    bottom: tokens.placement[placement].tooltipBottom,
    left: tokens.placement[placement].tooltipLeft,
    transform: tokens.placement[placement].transform,
  }

  const tooltipProps = {
    margin: tokens.placement[placement].margin,
  }

  const arrowProps = {
    left: tokens.placement[placement].arrowLeft,
    right: tokens.placement[placement].arrowRight,
    top: tokens.placement[placement].arrowTop,
    bottom: tokens.placement[placement].arrowBottom,
  }

  return (
    <Anchor {...props}>
      {children}
      <StyledTooltipWrapper {...wrapperProps}>
        <StyledTooltip {...tooltipProps}>
          <TooltipArrow {...arrowProps} />
          {title}
        </StyledTooltip>
      </StyledTooltipWrapper>
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
