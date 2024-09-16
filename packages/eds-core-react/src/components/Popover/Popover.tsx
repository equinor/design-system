import {
  forwardRef,
  useEffect,
  HTMLAttributes,
  SVGProps,
  useRef,
  useMemo,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Paper } from '../Paper'
import {
  typographyTemplate,
  bordersTemplate,
  mergeRefs,
  useToken,
  outlineTemplate,
} from '@equinor/eds-utils'
import { popover as popoverToken } from './Popover.tokens'
import { useEds } from '../EdsProvider'
import {
  Placement,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  useFloating,
  useInteractions,
  useDismiss,
  FloatingFocusManager,
} from '@floating-ui/react'

const PopoverPaper = styled(Paper)(({ theme }) => {
  const {
    entities: { paper },
  } = theme

  return css`
    position: relative;
    ${typographyTemplate(theme.typography)}
    background: ${theme.background};
    ${bordersTemplate(theme.border)}
    &:focus-visible {
      ${outlineTemplate(paper.states.focus.outline)}
    }
  `
})

const StyledPopover = styled('div').withConfig({
  shouldForwardProp: () => true, //workaround to avoid warning until popover gets added to react types
})<{ popover: string }>`
  inset: unset;
  border: 0;
  padding: 0;
  margin: 0;
  overflow: visible;
  background-color: transparent;
  &::backdrop {
    background-color: transparent;
  }
`

const ArrowWrapper = styled.div(({ theme }) => {
  return css`
    position: absolute;
    width: ${theme.entities.arrow.width};
    height: ${theme.entities.arrow.height};
  `
})

const InnerWrapper = styled.div(({ theme }) => {
  return css`
    display: grid;
    grid-gap: ${theme.spacings.bottom};
    max-height: ${theme.maxHeight};
    width: max-content;
    max-width: ${theme.maxWidth};
    overflow: auto;
  `
})

type ArrowProps = {
  ref?: React.MutableRefObject<null>
} & SVGProps<SVGSVGElement>

const PopoverArrow = styled.svg<ArrowProps>(({ theme }) => {
  return css`
    width: ${theme.entities.arrow.width};
    height: ${theme.entities.arrow.height};
    position: absolute;
    fill: ${theme.background};
    filter: drop-shadow(-4px 0px 2px rgba(0, 0, 0, 0.2));
  `
})

export type PopoverProps = {
  /**  Popover placement relative to anchor */
  placement?: Placement
  /**  On Close callback */
  onClose?: () => void
  /** Anchor element reference */
  anchorEl?: HTMLElement | null
  /** Is Popover open */
  open: boolean
  /**
   * @deprecated  Popover now uses the native popover api instead of react portal. This prop will be removed in a future version
   */
  withinPortal?: boolean
  /** Determines whether focus should be trapped within dropdown,
   * default to false. */
  trapFocus?: boolean
} & HTMLAttributes<HTMLDivElement>

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      children,
      placement = 'bottom',
      anchorEl,
      style,
      open,
      onClose,
      withinPortal,
      trapFocus,
      ...rest
    },
    ref,
  ) {
    if (withinPortal) {
      console.warn(
        'Popover "withinPortal" prop has been deprecated. Popover now uses the native popover api',
      )
    }
    const arrowRef = useRef<HTMLDivElement>(null)

    const {
      x,
      y,
      refs,
      strategy,
      context,
      middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
      placement: finalPlacement,
    } = useFloating({
      elements: {
        reference: anchorEl,
      },
      placement,
      open,
      onOpenChange: onClose,
      middleware: [
        offset(14),
        flip(),
        shift({ padding: 8 }),
        arrow({ element: arrowRef }),
      ],
      whileElementsMounted: autoUpdate,
    })

    const popoverRef = useMemo(
      () => mergeRefs<HTMLDivElement>(refs.setFloating, ref),
      [refs.setFloating, ref],
    )

    const { getFloatingProps } = useInteractions([useDismiss(context)])

    useEffect(() => {
      if (open) {
        setTimeout(() => {
          if (refs.floating.current?.isConnected) {
            refs.floating.current.showPopover()
          }
        }, 1)
      } else {
        refs.floating.current?.hidePopover()
      }
    }, [open, refs.floating])

    useEffect(() => {
      if (arrowRef.current) {
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
        Object.assign(arrowRef.current.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-6px',
          transform: arrowTransform,
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arrowRef.current, arrowX, arrowY, finalPlacement])

    const props = {
      ...rest,
    }

    const { density } = useEds()
    const token = useToken({ density }, popoverToken)

    const popover = (
      <ThemeProvider theme={token}>
        <StyledPopover
          popover="manual"
          {...getFloatingProps({
            ref: popoverRef,
            style: {
              ...style,
              position: strategy,
              top: y || 0,
              left: x || 0,
            },
          })}
        >
          <PopoverPaper elevation="overlay" {...props}>
            <ArrowWrapper ref={arrowRef} className="arrow">
              <PopoverArrow className="arrowSvg">
                <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
              </PopoverArrow>
            </ArrowWrapper>
            <InnerWrapper>{children}</InnerWrapper>
          </PopoverPaper>
        </StyledPopover>
      </ThemeProvider>
    )

    return (
      <>
        {trapFocus
          ? open && (
              <FloatingFocusManager context={context} modal={true}>
                {popover}
              </FloatingFocusManager>
            )
          : open && popover}
      </>
    )
  },
)
