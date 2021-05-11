import {
  forwardRef,
  useRef,
  useState,
  HTMLAttributes,
  SVGProps,
  useEffect,
  cloneElement,
} from 'react'
import * as ReactDom from 'react-dom'
import styled, { css } from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
} from '../../utils'
import {
  usePopper,
  Placement,
  useId,
  useGlobalKeyPress,
  useIsMounted,
} from '../../hooks'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledTooltip = styled.div<{ open: boolean }>`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}

  background: ${tokens.background};
  z-index: 350;
  white-space: nowrap;

  .arrow {
    z-index: -1;
    width: ${tokens.entities.arrow.width};
    height: ${tokens.entities.arrow.height};
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: ${tokens.entities.arrow.spacings.bottom};
    .arrowSvg {
      transform: rotate(-90deg);
    }
  }

  &[data-popper-placement^='bottom'] > .arrow {
    top: ${tokens.entities.arrow.spacings.top};
    .arrowSvg {
      transform: rotate(90deg);
    }
  }

  &[data-popper-placement^='left'] > .arrow {
    right: ${tokens.entities.arrow.spacings.right};
    .arrowSvg {
      transform: rotate(-180deg);
    }
  }

  &[data-popper-placement^='right'] > .arrow {
    left: ${tokens.entities.arrow.spacings.left};
  }
`

const ArrowWrapper = styled.div`
  &,
  &::before {
    position: absolute;
    width: ${tokens.entities.arrow.width};
    height: ${tokens.entities.arrow.height};
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
  width: ${tokens.entities.arrow.width};
  height: ${tokens.entities.arrow.height};
  position: absolute;
  fill: ${tokens.background};
`

export type TooltipProps = {
  /** Tooltip placement relative to anchor */
  placement?: Placement
  /** Tooltip title */
  title?: string
  /** Tooltip anchor element */
  children: React.ReactElement
  /** Delay in ms, default 100 */
  enterDelay?: number
} & HTMLAttributes<HTMLDivElement>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    { title, placement = 'bottom', children, enterDelay = 100, id, ...rest },
    ref,
  ) {
    const isMounted = useIsMounted()
    const [popperEl, setPopperEl] = useState<HTMLElement>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>()
    const containerId = 'eds-tooltip-container'
    const tooltipId = useId(id, 'tooltip')
    const shouldOpen = isMounted && title !== ''
    const openTimer = useRef<number>()

    useEffect(() => {
      if (document.getElementById(containerId) === null) {
        const tooltipContainerElement = document.createElement('div')
        tooltipContainerElement.id = containerId
        document.body.appendChild(tooltipContainerElement)
      }
      return () => {
        clearTimeout(openTimer.current)
      }
    }, [])

    const openTooltip = () => {
      if (shouldOpen) {
        clearTimeout(openTimer.current)

        openTimer.current = setTimeout(() => {
          setOpen(true)
        }, enterDelay)
      }
    }

    const closeTooltip = () => {
      clearTimeout(openTimer.current)
      setOpen(false)
    }

    useGlobalKeyPress('Escape', () => closeTooltip())

    const { styles, attributes } = usePopper(
      anchorRef.current,
      popperEl,
      arrowRef,
      placement,
      14,
    )

    const props = {
      open,
      ...rest,
      ...attributes.popper,
    }

    const updatedChildren = cloneElement(children, {
      ref: anchorRef,
      'aria-describedby': open ? tooltipId : null,
      onMouseOver: openTooltip,
      onMouseLeave: closeTooltip,
      onPointerEnter: openTooltip,
      onPointerLeave: closeTooltip,
      onBlur: closeTooltip,
      onFocus: openTooltip,
    } as HTMLAttributes<React.ReactElement>)

    return (
      <>
        {shouldOpen &&
          open &&
          ReactDom.createPortal(
            <StyledTooltip
              id={tooltipId}
              role="tooltip"
              ref={setPopperEl}
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
            document.getElementById(containerId),
          )}
        {updatedChildren}
      </>
    )
  },
)
