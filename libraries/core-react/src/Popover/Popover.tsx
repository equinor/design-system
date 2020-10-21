import React, { forwardRef, useRef, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { PopoverItem } from './PopoverItem'

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
type PopoverChild = {
  type?: { displayName?: string }
} & ReactNode

export type Props = {
  /* Popover placement relative to anchor */
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
  /**  Open activates <PopoverItem/> */
  open?: boolean
} & HTMLAttributes<HTMLDivElement>

// Controller Component for PopoverItem
export const Popover = forwardRef<HTMLDivElement, Props>(function Popover(
  { open, children, placement = 'bottom', ...rest },
  ref,
) {
  const props = {
    ...rest,
    placement,
    ref,
  }

  const anchorRef = useRef<HTMLDivElement>(null)
  const popoverChildren: PopoverChild | PopoverChild[] = children
  let anchorElement: PopoverChild
  const childArray = []
  if (Array.isArray(popoverChildren)) {
    for (let i = 0; i < popoverChildren.length; i += 1) {
      /* 
      Find anchor element in children to wrap the element together with <PopoverItem/>.
      Children is required, but user has to wrap the actual anchor with <PopoverAnchor />
      */
      const child = popoverChildren[i] as PopoverChild
      if (child.type && child.type.displayName === 'eds-popover-anchor') {
        anchorElement = child
      } else {
        // Add the remaining children to a new array to display inside <PopoverItem/>
        childArray.push(child)
      }
    }
  } else if (
    !Array.isArray(popoverChildren) &&
    popoverChildren.type &&
    popoverChildren.type.displayName === 'eds-popover-anchor'
  ) {
    anchorElement = popoverChildren
  }

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
})

Popover.displayName = 'eds-popover'
