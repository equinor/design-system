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
import * as PopperJS from '@popperjs/core'
import { usePopper, Popper } from 'react-popper'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { Card } from '../Card'
import { Button } from '../Button'
import { close } from '@equinor/eds-icons'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { useCombinedRefs } from '@hooks'
import { PopoverItem } from './PopoverItem'
import { PopoverAnchor } from './PopoverAnchor'
import { popover as tokens } from './Popover.tokens'

const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
`

const Anchor = styled.div`
  &:focus {
    outline: none;
  }
`
type PopoverSplit = {
  anchorElement: ReactNode
  childArray: ReactNode[]
}

//////////
// Moved from PopoverItem
type WrapperProps = {
  top: string | number
  bottom: string | number
  right: string | number
  left: string | number
  transform: string
}

const StyledPopoverWrapper = styled.div`
  width: max-content;
  align-self: center;
  position: absolute;
  z-index: 100;
  flex-shrink: 0;
  ::after {
    content: '';
  }
`

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

const PopoverArrow = styled.div`
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: ${tokens.background};
  filter: drop-shadow(-4px 0px 2px rgba(0, 0, 0, 0.2));
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
////////

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

// TODO: clean up after popper js spike
export type PopoverProps = {
  /**  Popover placement relative to anchor */
  placement?:
    | 'topLeft'
    | 'top'
    | 'topRight'
    | 'rightTop'
    | 'right'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottom'
    | 'bottomRight'
    | 'leftTop'
    | 'left'
    | 'leftBottom'
  /** popper placement */
  position?:
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
  /**  On Close function */
  onClose?: () => void
  /**  Open activates Popover */
  open?: boolean
  /** Anchor element reference */
  anchorEl?: MutableRefObject<null>
} & HTMLAttributes<HTMLDivElement>

// Controller Component for PopoverItem
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      open,
      children,
      placement = 'bottom',
      position = 'bottom',
      anchorEl,
      onClose,
      ...rest
    },
    ref,
  ) {
    const props = {
      ...rest,
      placement,
      ref,
    }
    if (!children) {
      return <Container {...props} />
    }
    const anchorRef = useRef<HTMLDivElement>(null)

    const { anchorElement, childArray } = React.Children.toArray(
      children,
    ).reduce(
      (acc: PopoverSplit, child): PopoverSplit => {
        if (isValidElement(child) && child.type === PopoverAnchor) {
          return {
            ...acc,
            anchorElement: child,
          }
        }
        return {
          ...acc,
          childArray: [...acc.childArray, child],
        }
      },
      { anchorElement: null, childArray: [] },
    )

    if (open && anchorRef.current) {
      anchorRef.current.focus()
    }

    // React Popper example
    const popperRef = useRef<HTMLDivElement | null>(null)
    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null)

    const { styles, attributes } = usePopper(
      anchorEl.current,
      popperRef.current,

      {
        placement: position,
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: arrowRef,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ],
      },
    )

    return (
      <StyledPopover
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
      >
        <Arrow ref={setArrowRef} style={styles.arrow} className="arrow" />

        {children}
        <StyledCloseButton onClick={onClose} variant="ghost_icon">
          <Icon name="close" data={close} title="close" size={48} />
        </StyledCloseButton>
      </StyledPopover>
    )
  },
)

// Popover.displayName = 'eds-popover'
// Todo remove Old return:
// return (
//   <Container {...props}>
//     <Anchor aria-haspopup="true" ref={anchorRef}>
//       {anchorElement}
//     </Anchor>

//     {open && (
//       <PopoverItem {...props} anchorRef={anchorRef}>
//         {childArray}
//       </PopoverItem>
//     )}
//   </Container>
// )
