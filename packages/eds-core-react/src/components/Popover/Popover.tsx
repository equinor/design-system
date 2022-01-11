import {
  forwardRef,
  useState,
  HTMLAttributes,
  SVGProps,
  useEffect,
} from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Paper } from '../Paper'
import {
  spacingsTemplate,
  typographyTemplate,
  bordersTemplate,
} from '../../utils'
import {
  usePopper,
  useOutsideClick,
  Placement,
  useGlobalKeyPress,
  useCombinedRefs,
  useToken,
} from '../../hooks'
import { popover as popoverToken } from './Popover.tokens'
import { useEds } from '../EdsProvider'

type StyledPopoverProps = Pick<PopoverProps, 'open'>

const PopoverPaper = styled(Paper)<StyledPopoverProps>(({ theme, open }) => {
  return css`
    ${{ visibility: open ? null : 'hidden' }}
    ${typographyTemplate(theme.typography)}
    display: grid;
    grid-gap: ${theme.spacings.bottom};
    grid-auto-columns: auto;
    align-items: center;
    align-content: start;
    background: ${theme.background};
    width: max-content;
    max-height: ${theme.maxHeight};
    max-width: ${theme.maxWidth};
    min-height: ${theme.minHeight};
    ${bordersTemplate(theme.border)}
    z-index: 300;

    .arrow {
      z-index: -1;
      width: ${theme.entities.arrow.width};
      height: ${theme.entities.arrow.height};
    }
    &[data-popper-placement^='top'] > .arrow {
      bottom: ${theme.entities.arrow.spacings.bottom};
      .arrowSvg {
        transform: rotate(-90deg);
      }
    }

    &[data-popper-placement^='bottom'] > .arrow {
      top: ${theme.entities.arrow.spacings.top};
      .arrowSvg {
        transform: rotate(90deg);
      }
    }

    &[data-popper-placement^='left'] > .arrow {
      right: ${theme.entities.arrow.spacings.right};
      .arrowSvg {
        transform: rotate(-180deg);
      }
    }

    &[data-popper-placement^='right'] > .arrow {
      left: ${theme.entities.arrow.spacings.left};
    }
  `
})

const ArrowWrapper = styled.div(({ theme }) => {
  return css`
    &,
    &::before {
      position: absolute;
      width: ${theme.entities.arrow.width};
      height: ${theme.entities.arrow.height};
      z-index: -1;
    }

    &::before {
      content: '';
    }
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
} & HTMLAttributes<HTMLDivElement>

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    { children, placement = 'bottom', anchorEl, open, onClose, ...rest },
    ref,
  ) {
    const [popperEl, setPopperEl] = useState<HTMLElement>(null)
    const [storedAnchorEl, setStoredAnchorEl] = useState<HTMLElement>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    const popoverRef = useCombinedRefs<HTMLDivElement>(ref, setPopperEl)

    useOutsideClick(popperEl, (e: MouseEvent) => {
      if (
        open &&
        onClose !== null &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose()
      }
    })

    useGlobalKeyPress('Escape', () => {
      if (onClose !== null && open) {
        onClose()
      }
    })

    useEffect(() => {
      open ? setStoredAnchorEl(anchorEl) : setStoredAnchorEl(null)
      return () => setStoredAnchorEl(null)
    }, [anchorEl, open])

    const { styles, attributes } = usePopper(
      storedAnchorEl,
      popperEl,
      arrowRef,
      placement,
    )

    const props = {
      open,
      ...rest,
      ...attributes.popper,
    }

    const { density } = useEds()
    const token = useToken({ density }, popoverToken)

    return (
      <ThemeProvider theme={token}>
        <PopoverPaper
          ref={popoverRef}
          elevation="overlay"
          style={styles.popper}
          data-testid="popover"
          {...props}
        >
          <ArrowWrapper
            ref={setArrowRef}
            style={styles.arrow}
            className="arrow"
          >
            <PopoverArrow className="arrowSvg">
              <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
            </PopoverArrow>
          </ArrowWrapper>
          {children}
        </PopoverPaper>
      </ThemeProvider>
    )
  },
)
