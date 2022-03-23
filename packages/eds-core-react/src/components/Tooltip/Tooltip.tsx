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
import styled from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
  joinHandlers,
  usePopper,
  Placement,
  useId,
  useGlobalKeyPress,
  useIsMounted,
  useCombinedRefs,
} from '@equinor/eds-utils'
import { tooltip as tokens } from './Tooltip.tokens'

const StyledTooltip = styled.div<{ open: boolean }>`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}
  background: ${tokens.background};
  z-index: 1500;
  white-space: nowrap;

  .arrow {
    z-index: -1;
    width: ${tokens.entities.arrow.width};
    height: ${tokens.entities.arrow.height};
  }
  &[data-popper-placement^='top'] > .arrow {
    bottom: ${tokens.entities.arrow.spacings.bottom};
    .arrow-svg {
      transform: rotate(-90deg);
    }
  }

  &[data-popper-placement^='bottom'] > .arrow {
    top: ${tokens.entities.arrow.spacings.top};
    .arrow-svg {
      transform: rotate(90deg);
    }
  }

  &[data-popper-placement^='left'] > .arrow {
    right: ${tokens.entities.arrow.spacings.right};
    .arrow-svg {
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
  children: React.ReactElement & React.RefAttributes<HTMLElement>
  /** Delay in ms, default 100 */
  enterDelay?: number
} & HTMLAttributes<HTMLDivElement>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(
    {
      title,
      placement = 'bottom',
      children,
      enterDelay = 100,
      id,
      style,
      ...rest
    },
    ref,
  ) {
    const isMounted = useIsMounted()
    const [popperEl, setPopperEl] = useState<HTMLElement>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    const openTimer = useRef<ReturnType<typeof setTimeout>>()
    const tooltipRef = useCombinedRefs<HTMLDivElement>(setPopperEl, ref)
    const anchorRef = useRef<HTMLElement>()
    const combinedChilddRef = useCombinedRefs<HTMLElement>(
      anchorRef,
      children?.ref,
    )
    const tooltipId = useId(id, 'tooltip')
    const containerId = 'eds-tooltip-container'
    const shouldOpen = isMounted && title !== ''

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

    const { styles, attributes } = usePopper({
      anchorEl: anchorRef.current,
      popperEl,
      arrowRef,
      placement,
      offset: 14,
    })

    const props = {
      open,
      style: { ...styles.popper, ...style },
      ...rest,
      ...attributes.popper,
    }

    const childProps = children.props as HTMLAttributes<HTMLElement>
    const updatedChildren = cloneElement(children, {
      ref: combinedChilddRef,
      'aria-describedby': open ? tooltipId : null,
      onMouseOver: joinHandlers(openTooltip, childProps.onMouseOver),
      onMouseLeave: joinHandlers(closeTooltip, childProps.onMouseLeave),
      onPointerEnter: joinHandlers(openTooltip, childProps.onPointerEnter),
      onPointerLeave: joinHandlers(closeTooltip, childProps.onPointerLeave),
      onBlur: joinHandlers(closeTooltip, childProps.onBlur),
      onFocus: joinHandlers(openTooltip, childProps.onFocus),
    } as HTMLAttributes<HTMLElement>)

    return (
      <>
        {shouldOpen &&
          open &&
          ReactDom.createPortal(
            <StyledTooltip
              id={tooltipId}
              role="tooltip"
              ref={tooltipRef}
              {...props}
            >
              {title}
              <ArrowWrapper
                ref={setArrowRef}
                style={styles.arrow}
                className="arrow"
              >
                <TooltipArrow className="arrow-svg">
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
