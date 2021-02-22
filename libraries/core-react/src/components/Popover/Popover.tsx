import * as React from 'react'
import {
  forwardRef,
  useRef,
  useState,
  HTMLAttributes,
  ReactNode,
  isValidElement,
  MutableRefObject,
} from 'react'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { Card } from '../Card'
import { Button } from '../Button'
import { close } from '@equinor/eds-icons'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { usePopper } from '@hooks'
import { popover as tokens } from './Popover.tokens'

const StyledPopover = styled(Card)`
  ${typographyTemplate(tokens.header)}
  ${spacingsTemplate(tokens.spacings)}
  background: ${tokens.background};
  fill: ${tokens.background};
  width: max-content;
  max-height: ${tokens.popover.maxHeight};
  max-width: ${tokens.popover.maxWidth};
  min-height: ${tokens.popover.minHeight};
  box-shadow: ${tokens.elevation};
  z-index: 100;

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
  anchorEl?: MutableRefObject<null>
} & HTMLAttributes<HTMLDivElement>

// Controller Component for PopoverItem
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    { children, placement = 'bottom', anchorEl, onClose, ...rest },
    ref,
  ) {
    // React Popper example
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(
      anchorEl,
      popperRef,
      arrowRef,
      placement,
    )

    const props = {
      ...rest,
      ...attributes.popper,
    }
    return (
      <StyledPopover ref={popperRef} style={styles.popper} {...props}>
        <Arrow ref={setArrowRef} style={styles.arrow} className="arrow" />

        {children}
        <StyledCloseButton onClick={onClose} variant="ghost_icon">
          <Icon name="close" data={close} title="close" size={48} />
        </StyledCloseButton>
      </StyledPopover>
    )
  },
)
