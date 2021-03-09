import * as React from 'react'
import { forwardRef, useRef, useState, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { Paper } from '../Paper'
import { Button } from '../Button'
import { close } from '@equinor/eds-icons'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { usePopper, useOutsideClick } from '@hooks'
import { popover as tokens } from './Popover.tokens'

type StyledPopoverProps = Pick<PopoverProps, 'open'>

const StyledPopover = styled(Paper)<StyledPopoverProps>`
  ${typographyTemplate(tokens.header)}
  ${spacingsTemplate(tokens.spacings)}
  display: grid;
  grid-gap: 16px;
  grid-auto-columns: auto;
  align-items: center;
  align-content: start;
  background: ${tokens.background};
  width: max-content;
  max-height: ${tokens.popover.maxHeight};
  max-width: ${tokens.popover.maxWidth};
  min-height: ${tokens.popover.minHeight};
  z-index: 100;

  ${({ open }) =>
    css({
      visibility: open ? 'visible' : 'hidden',
    })};

  .arrow {
    z-index: -1;
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

const StyledCloseButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 16px;
  height: 32px;
  width: 32px;
  &:after {
    height: 32px;
  }
`

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
    background: ${tokens.background};
    filter: drop-shadow(-4px 0px 2px rgba(0, 0, 0, 0.2));
  }
`
export type PopoverProps = {
  /**  Popover placement relative to anchor */
  placement?:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
  /**  On Close callback */
  onClose?: () => void
  /** Anchor element reference */
  anchorEl: HTMLElement
  open?: boolean
} & HTMLAttributes<HTMLDivElement>

// Controller Component for PopoverItem
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      children,
      placement = 'bottom',
      anchorEl,
      open = false,
      onClose,
      ...rest
    },
    ref,
  ) {
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)
    useOutsideClick(popperRef, anchorEl, () => {
      if (open && onClose !== null) {
        onClose()
      }
    })

    const { styles, attributes } = usePopper(
      anchorEl,
      popperRef.current,
      arrowRef,
      placement,
    )

    const props = {
      open,
      ...rest,
      ...attributes.popper,
    }
    return (
      <StyledPopover
        ref={popperRef}
        elevation="overlay"
        style={styles.popper}
        {...props}
        data-testid="popover"
      >
        <Arrow ref={setArrowRef} style={styles.arrow} className="arrow" />

        {children}
        <StyledCloseButton
          onClick={onClose}
          variant="ghost_icon"
          data-testid="popover-close"
        >
          <Icon name="close" data={close} title="close" size={48} />
        </StyledCloseButton>
      </StyledPopover>
    )
  },
)
