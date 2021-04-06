import * as React from 'react'
import { forwardRef, useRef, useState, HTMLAttributes, SVGProps } from 'react'
import * as ReactDom from 'react-dom'
import styled, { css } from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { usePopper, Placement } from '@hooks'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledTooltip = styled.div<{ open: boolean }>`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  z-index: 350;
  background: ${tokens.background};
  border-radius: ${tokens.borderRadius};
  white-space: nowrap;
  ${({ open }) =>
    css({
      visibility: open ? 'visible' : 'hidden',
    })};
  .arrow {
    z-index: -1;
    width: ${tokens.arrow.width};
    height: ${tokens.arrow.height};
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: ${tokens.arrow.placement};
    .arrowSvg {
      transform: rotate(-90deg);
    }
  }

  &[data-popper-placement^='bottom'] > .arrow {
    top: ${tokens.arrow.placement};
    .arrowSvg {
      transform: rotate(90deg);
    }
  }

  &[data-popper-placement^='left'] > .arrow {
    right: ${tokens.arrow.placement};
    .arrowSvg {
      transform: rotate(-180deg);
    }
  }

  &[data-popper-placement^='right'] > .arrow {
    left: ${tokens.arrow.placement};
  }
`

const ArrowWrapper = styled.div`
  &,
  &::before {
    position: absolute;
    width: ${tokens.arrow.width};
    height: ${tokens.arrow.height};
    z-index: -1;
  }

  &::before {
    content: '';
  }
`

type ArrowProps = {
  ref?: React.MutableRefObject<null>
} & SVGProps<SVGSVGElement>

const TooltipArrow = styled.svg<ArrowProps>`
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: ${tokens.background};
  filter: drop-shadow(-4px 0px 2px rgba(0, 0, 0, 0.2));
`

export type TooltipProps = {
  /** Tooltip placement relative to anchor */
  placement?: Placement
  /** Tooltip title */
  title?: string
  /** Tooltip anchor element */
  children: React.ReactElement
} & HTMLAttributes<HTMLDivElement>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip({ title, placement = 'bottom', children, ...rest }, ref) {
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>()
    const tooltipId = 'eds-tooltip-container'
    const tooltipContainerEl = document.getElementById(tooltipId)

    React.useEffect(() => {
      if (document.getElementById(tooltipId) === null) {
        const tooltipContainerElement = document.createElement('div')
        tooltipContainerElement.id = tooltipId
        document.body.appendChild(tooltipContainerElement)
      }
    }, [])

    const openTooltip = () => setOpen(true)
    const closeTooltip = () => setOpen(false)

    const { styles, attributes } = usePopper(
      anchorRef.current,
      popperRef.current,
      arrowRef,
      placement,
    )

    const props = {
      open,
      ...rest,
      ...attributes.popper,
    }

    const updatedChildren = React.cloneElement(children, {
      ref: anchorRef,
      onMouseOver: openTooltip,
      onMouseLeave: closeTooltip,
      onPointerEnter: openTooltip,
      onPointerLeave: closeTooltip,
      onBlur: closeTooltip,
      onFocus: openTooltip,
    })

    return (
      <>
        {tooltipContainerEl &&
          ReactDom.createPortal(
            <StyledTooltip
              role="tooltip"
              ref={popperRef}
              style={styles.popper}
              {...props}
            >
              {title}
              <ArrowWrapper
                ref={setArrowRef}
                style={styles.arrow}
                className="arrow"
              >
                <TooltipArrow className="arrowSvg">
                  <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
                </TooltipArrow>
              </ArrowWrapper>
            </StyledTooltip>,
            tooltipContainerEl,
          )}
        {updatedChildren}
      </>
    )
  },
)
