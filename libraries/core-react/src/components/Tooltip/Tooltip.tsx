import * as React from 'react'
import {
  forwardRef,
  useRef,
  useState,
  HTMLAttributes,
  SVGProps,
  MutableRefObject,
} from 'react'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { usePopper, Placement } from '@hooks'
import { tooltip as tokens } from './Tooltip.tokens'

const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  &::before {
    content: '';
    transform: rotate(45deg);
    background: #333;
  }
`

const StyledTooltip = styled.div`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  z-index: 350;
  background: ${tokens.background};
  fill: ${tokens.background};
  border-radius: ${tokens.borderRadius};
  min-height: ${tokens.tooltip.minHeight};
  box-sizing: border-box;
  .arrow {
    position: absolute;
    width: 10px;
    height: 10px;
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: -4px;
  }

  &[data-popper-placement^='bottom'] > .arrow {
    top: -4px;
  }

  &[data-popper-placement^='left'] > .arrow {
    right: -4px;
  }

  &[data-popper-placement^='right'] > .arrow {
    left: -4px;
  }
`

export type TooltipProps = {
  /** Tooltip placement relative to anchor */
  placement?: Placement
  /** Tooltip title when children is the anchor */
  title?: string
  /** Reference element for having tooltip decupled from the anchor (in tables etc) */
  anchorEl?: MutableRefObject<null>
} & HTMLAttributes<HTMLDivElement>

// Controller for TooltipItem
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { className, title, anchorEl, placement = 'bottom', ...rest },
    ref,
  ) {
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(
      anchorEl,
      popperRef,
      arrowRef,
      placement,
    )

    const props = {
      ...attributes.popper,
      className,
      ...rest,
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
