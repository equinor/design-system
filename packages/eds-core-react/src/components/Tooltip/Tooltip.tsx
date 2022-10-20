import {
  forwardRef,
  useRef,
  useState,
  HTMLAttributes,
  SVGProps,
  cloneElement,
  useMemo,
  useEffect,
} from 'react'
import styled from 'styled-components'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
  mergeRefs,
} from '@equinor/eds-utils'
import { tooltip as tokens } from './Tooltip.tokens'
import {
  Placement,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useDismiss,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions'

const StyledTooltip = styled.div`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}

  background: ${tokens.background};
  z-index: 1500;
  white-space: nowrap;

  &::before {
    content: '; Has tooltip: ';
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }
`

const ArrowWrapper = styled.div`
  position: absolute;
  width: ${tokens.entities.arrow.width};
  height: ${tokens.entities.arrow.height};
  z-index: -1;
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
    { title, placement = 'bottom', children, style, enterDelay = 100, ...rest },
    ref,
  ) {
    const arrowRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const shouldOpen = title !== ''

    const {
      x,
      y,
      reference,
      floating,
      strategy,
      context,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
      placement: finalPlacement,
    } = useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      middleware: [
        offset(14),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowRef }),
      ],
      whileElementsMounted: autoUpdate,
    })
    const anchorRef = useMemo(
      () => mergeRefs<HTMLElement>(reference, children?.ref),
      [reference, children?.ref],
    )
    const tooltipRef = useMemo(
      () => mergeRefs<HTMLDivElement>(floating, ref),
      [floating, ref],
    )

    const { getReferenceProps, getFloatingProps } = useInteractions([
      useHover(context, { delay: { open: enterDelay } }),
      useFocus(context),
      useRole(context, { role: 'tooltip' }),
      useDismiss(context),
    ])

    useEffect(() => {
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[finalPlacement.split('-')[0]]

      let arrowTransform = 'none'
      switch (staticSide) {
        case 'right':
          arrowTransform = 'rotateY(180deg)'
          break
        case 'left':
          arrowTransform = 'none'
          break
        case 'top':
          arrowTransform = 'rotate(90deg)'
          break
        case 'bottom':
          arrowTransform = 'rotate(-90deg)'
          break
      }

      if (arrowRef.current) {
        Object.assign(arrowRef.current.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-6px',
          transform: arrowTransform,
        })
      }
    })

    const updatedChildren = cloneElement(children, {
      ...getReferenceProps({
        ref: anchorRef,
        ...(children.props as HTMLAttributes<HTMLElement>),
      }),
    })

    return (
      <>
        <FloatingPortal id="eds-tooltip-container">
          {shouldOpen && open && (
            <StyledTooltip
              {...rest}
              {...getFloatingProps({
                ref: tooltipRef,
                style: {
                  ...style,
                  position: strategy,
                  top: y || 0,
                  left: x || 0,
                },
              })}
            >
              {title}
              <ArrowWrapper ref={arrowRef}>
                <TooltipArrow className="arrowSvg">
                  <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
                </TooltipArrow>
              </ArrowWrapper>
            </StyledTooltip>
          )}
        </FloatingPortal>
        {updatedChildren}
      </>
    )
  },
)
