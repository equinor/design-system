import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { tooltip as tokens } from './Tooltip.tokens'

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
  fill: #333;
  border-radius: ${tokens.borderRadius};
  min-height:  ${tokens.tooltip.minHeight};
  box-sizing: border-box;
  position: relative;
`

const TooltipArrow = styled.svg`
  ${({ top, bottom, right, left }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
    `}
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: inherit;
`

export const TooltipItem = forwardRef(function TooltipItem({
  title,
  placement,
}) {
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
  }

  return (
    <StyledTooltipWrapper {...wrapperProps}>
      <StyledTooltip>
        <TooltipArrow
          {...arrowProps}
          style={{
            transform: `${tokens.placement[placement].arrowTransform}`,
          }}
        >
          <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
        </TooltipArrow>
        {title}
      </StyledTooltip>
    </StyledTooltipWrapper>
  )
})

TooltipItem.displayName = 'eds-tooltip-item'

TooltipItem.propTypes = {
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
  /** @ignore */
  className: PropTypes.string,
}

TooltipItem.defaultProps = {
  placement: 'bottom',
  title: '',
  className: '',
}
