import React, {
  forwardRef,
  useRef,
  HTMLAttributes,
  ReactNode,
  isValidElement,
} from 'react'
import styled from 'styled-components'
import { PopoverItem } from './PopoverItem'
import { PopoverAnchor } from './PopoverAnchor'

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
  /**  On Close function */
  onClose?: () => void
  /**  Open activates Popover */
  open?: boolean
} & HTMLAttributes<HTMLDivElement>

// Controller Component for PopoverItem
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover({ open, children, placement = 'bottom', ...rest }, ref) {
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

    return (
      <Container {...props}>
        <Anchor aria-haspopup="true" ref={anchorRef}>
          {anchorElement}
        </Anchor>

        {open && (
          <PopoverItem {...props} anchorRef={anchorRef}>
            {childArray}
          </PopoverItem>
        )}
      </Container>
    )
  },
)

// Popover.displayName = 'eds-popover'
