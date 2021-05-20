import { forwardRef, useState, HTMLAttributes, SVGProps } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { Paper } from '../Paper'
import { Button } from '../Button'
import { close } from '@equinor/eds-icons'
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
} from '../../hooks'
import { popover as tokens } from './Popover.tokens'

type StyledPopoverProps = Pick<PopoverProps, 'open'>

const PopoverPaper = styled(Paper)<StyledPopoverProps>`
  ${({ open }) => css({ visibility: open ? null : 'hidden' })}
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  display: grid;
  grid-gap: ${tokens.spacings.bottom};
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  background: ${tokens.background};
  width: max-content;
  max-height: ${tokens.maxHeight};
  max-width: ${tokens.maxWidth};
  min-height: ${tokens.minHeight};
  ${bordersTemplate(tokens.border)}
  z-index: 100;

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

const StyledCloseButton = styled(Button)`
  position: absolute;
  top: ${tokens.entities.closeButton.spacings.top};
  right: ${tokens.spacings.right};
  height: ${tokens.entities.closeButton.height};
  width: ${tokens.entities.closeButton.width};
  &:after {
    height: ${tokens.entities.closeButton.height};
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

const PopoverArrow = styled.svg<ArrowProps>`
  width: ${tokens.entities.arrow.width};
  height: ${tokens.entities.arrow.height};
  position: absolute;
  fill: ${tokens.background};
  filter: drop-shadow(-4px 0px 2px rgba(0, 0, 0, 0.2));
`
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
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    const popoverRef = useCombinedRefs<HTMLDivElement>(ref, setPopperEl)

    useOutsideClick(popperEl, (e: MouseEvent) => {
      if (open && onClose !== null && !anchorEl.contains(e.target as Node)) {
        onClose()
      }
    })

    useGlobalKeyPress('Escape', () => {
      if (onClose !== null) {
        onClose()
      }
    })

    const { styles, attributes } = usePopper(
      anchorEl,
      popperEl,
      arrowRef,
      placement,
    )

    const props = {
      open,
      ...rest,
      ...attributes.popper,
    }

    return (
      <PopoverPaper
        ref={popoverRef}
        elevation="overlay"
        style={styles.popper}
        data-testid="popover"
        {...props}
      >
        <ArrowWrapper ref={setArrowRef} style={styles.arrow} className="arrow">
          <PopoverArrow className="arrowSvg">
            <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
          </PopoverArrow>
        </ArrowWrapper>

        {children}
        <StyledCloseButton
          onClick={onClose}
          variant="ghost_icon"
          data-testid="popover-close"
        >
          <Icon name="close" data={close} title="close" size={24} />
        </StyledCloseButton>
      </PopoverPaper>
    )
  },
)
