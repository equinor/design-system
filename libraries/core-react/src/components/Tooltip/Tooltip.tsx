import * as React from 'react'
import { forwardRef, useRef, useState, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { usePopper, Placement } from '@hooks'
import { tooltip as tokens } from './Tooltip.tokens'

const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: ${tokens.arrow.width};
    height: ${tokens.arrow.height};
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: #333;
  }
`

const StyledTooltip = styled.div<Pick<TooltipProps, 'open'>>`
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
    position: absolute;
    width: ${tokens.arrow.width};
    height: ${tokens.arrow.height};
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: -${tokens.arrow.placement};
  }

  &[data-popper-placement^='bottom'] > .arrow {
    top: -${tokens.arrow.placement};
  }

  &[data-popper-placement^='left'] > .arrow {
    right: -${tokens.arrow.placement};
  }

  &[data-popper-placement^='right'] > .arrow {
    left: -${tokens.arrow.placement};
  }
`

export type TooltipProps = {
  /** Tooltip placement relative to anchor */
  placement?: Placement
  /** Tooltip title */
  title?: string
  /** Anchor element reference */
  anchorEl: HTMLElement
  /** Is tooltip open */
  open: boolean
} & HTMLAttributes<HTMLDivElement>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { className, title, anchorEl, placement = 'bottom', open = false, ...rest },
    ref,
  ) {
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(
      anchorEl,
      popperRef.current,
      arrowRef,
      placement,
    )

    const props = {
      ...rest,
      open,
      ...attributes.popper,
      className,
    }

    return (
      <StyledTooltip
        role="tooltip"
        ref={popperRef}
        style={styles.popper}
        {...props}
      >
        {title}
        <Arrow ref={setArrowRef} style={styles.arrow} className="arrow" />
      </StyledTooltip>
    )
  },
)
