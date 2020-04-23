import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

const Anchor = styled.div`
  position: relative;
  display: flex;
  width: auto;
  justify-content: center;
  &:hover,
  &:focus,
  &:focus-within {
    > :last-child {
      display: block;
    }
  }
`

const StyledTooltipWrapper = styled.div`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
  width: auto;
  display: none;
  position: absolute;
  z-index: 500;
  flex-shrink: 0;
  ::after {
    content: '';
  }
`

const StyledTooltip = styled.div`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  background: ${tokens.background};
  fill: ${tokens.background};
  border-radius: ${tokens.borderRadius};
  min-height:  ${tokens.tooltip.minHeight};
  box-sizing: border-box;
  position: relative;
`

const TooltipArrow = styled.svg`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: inherit;
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
    top: tokens.placement[placement].tooltipTop,
    bottom: tokens.placement[placement].tooltipBottom,
    left: tokens.placement[placement].tooltipLeft,
    transform: tokens.placement[placement].transform,
  }

  const arrowProps = {
    left: tokens.placement[placement].arrowLeft,
    right: tokens.placement[placement].arrowRight,
    top: tokens.placement[placement].arrowTop,
    bottom: tokens.placement[placement].arrowBottom,
    transform: tokens.placement[placement].arrowTransform,
  }

  return (
    <Anchor {...props}>
      {children}
      <StyledTooltipWrapper {...wrapperProps}>
        <StyledTooltip>
          <TooltipArrow {...arrowProps}>
            <path d="M4.83205 4.75192C4.43623 5.34566 3.56377 5.34566 3.16795 4.75192L1.44988e-07 -1.88344e-07L8 0L4.83205 4.75192Z" />
          </TooltipArrow>
          {title}
        </StyledTooltip>
      </StyledTooltipWrapper>
    </Anchor>
  )
})

Tooltip.displayName = 'eds-tooltip'

Tooltip.propTypes = {
  // Tooltip placement relative to anchor
  placement: PropTypes.oneOf([
    'topLeft',
    'top',
    'topRight',
    'rightTop',
    'right',
    'rightBottom',
    'bottomLeft',
    'bottom',
    'bottomRight',
    'leftTop',
    'left',
    'leftBottom',
  ]),
  // Tooltip title
  title: PropTypes.string,
  /** Tooltip reference/anchor element */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Tooltip.defaultProps = {
  placement: 'bottom',
  title: '',
  className: '',
}
