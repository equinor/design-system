import * as React from 'react'
import {
  forwardRef,
  useState,
  HTMLAttributes,
  ReactNode,
  SVGProps,
} from 'react'
import styled, { css } from 'styled-components'
import type { CSSObject } from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { tooltip as tokens, Placement } from './Tooltip.tokens'

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
`

type WrapperProps = {
  top: string | number
  bottom: string | number
  right: string | number
  left: string | number
  transform: string
}

const StyledTooltipWrapper = styled.div<WrapperProps>`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
  position: absolute;
  align-self: center;
  z-index: 350;
  white-space: nowrap;
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

type ArrowProps = {
  top: string
  bottom: string
  right: string
  left: string
} & SVGProps<SVGSVGElement>

const TooltipArrow = styled.svg<ArrowProps>`
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

export type TooltipProps = {
  /** Tooltip placement relative to anchor */
  placement?:
    | 'topLeft'
    | 'top'
    | 'topRight'
    | 'rightTop'
    | 'right'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottom'
    | 'bottomRight'
    | 'leftTop'
    | 'left'
    | 'leftBottom'
  /** For controlled Tooltip */
  open?: boolean
  /** Tooltip title */
  title?: string
  /** Tooltip reference/anchor element */
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

// Controller for TooltipItem
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      className,
      title = '',
      children,
      placement = 'bottom',
      open = false,
      ...rest
    },
    ref,
  ) {
    const [openState, setOpenState] = useState(open)

    const handleOpen = () => {
      setOpenState(true)
    }

    const handleClose = () => {
      setOpenState(false)
    }

    const props = {
      ...rest,
      className,
      ref,
    }

    const placementToken: Placement = tokens.placement[placement]

    const wrapperProps = {
      right: placementToken.tooltipRight,
      top: placementToken.tooltipTop,
      bottom: placementToken.tooltipBottom,
      left: placementToken.tooltipLeft,
      transform: placementToken.transform,
    }

    const arrowProps = {
      left: placementToken.arrowLeft,
      right: placementToken.arrowRight,
      top: placementToken.arrowTop,
      bottom: placementToken.arrowBottom,
    }
    const arrowStyle: CSSObject = {
      transform: `${placementToken.arrowTransform}`,
    }
    return (
      <Wrapper {...props}>
        <div
          onMouseOver={handleOpen}
          onMouseEnter={handleOpen}
          onPointerEnter={handleOpen}
          onPointerLeave={handleClose}
          onMouseOut={handleClose}
          onMouseLeave={handleClose}
          onBlur={handleClose}
          onFocus={handleOpen}
        >
          {children}
        </div>
        {openState && (
          <StyledTooltipWrapper
            style={{ justifySelf: 'center' }}
            role="tooltip"
            {...wrapperProps}
          >
            <StyledTooltip>
              <TooltipArrow {...arrowProps} style={arrowStyle}>
                <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
              </TooltipArrow>
              {title}
            </StyledTooltip>
          </StyledTooltipWrapper>
        )}
      </Wrapper>
    )
  },
)

// Tooltip.displayName = 'eds-tooltip'
