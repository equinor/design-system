import React, { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { PopoverItem } from './PopoverItem'

const Container = styled.div`
  position: relative;
  display: flex;
  width: auto;
  justify-content: center;
`

const Anchor = styled.div`
  :focus: {
    outline: none;
  }
`
// Controller Component for PopoverItem
export const Popover = forwardRef(function Popover(
  { className, open, children, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  const anchorRef = useRef(null)

  let anchorElement
  const childArray = []
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i += 1) {
      /* 
      Find anchor element in children to wrap the element together with <PopoverItem/>.
      Children is required, but user has to wrap the actual anchor with <PopoverAnchor />
      */
      if (
        children[i].type &&
        children[i].type.displayName === 'eds-popover-anchor'
      ) {
        anchorElement = children[i]
      } else {
        // Add the remaining children to a new array to display inside <PopoverItem/>
        childArray.push(children[i])
      }
    }
  } else if (
    !Array.isArray(children) &&
    children.type &&
    children.type.displayName === 'eds-popover-anchor'
  ) {
    anchorElement = children
  }

  console.log(anchorElement)

  if (open && anchorRef.current) {
    console.log('focus!', anchorRef.current)
    anchorRef.current.focus()
  }

  return (
    <Container {...props}>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex*/}
      <Anchor tabIndex={0} open={open} aria-haspopup="true" ref={anchorRef}>
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

Popover.propTypes = {
  // Popover placement relative to anchor
  placement: PropTypes.oneOf([
    'topLeft',
    'top',
    'topRight',
    'rightTop',
    'right',
    'rightBottom',
    'bottomLeft',
    'bottom',
    'bottomRight',
    'leftTop',
    'left',
    'leftBottom',
  ]),
  // On Close function:
  onClose: PropTypes.func,
  // Open activates <PopoverItem/>
  open: PropTypes.bool.isRequired,
  /** Popover reference/anchor element is required as a child */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Popover.defaultProps = {
  placement: 'bottom',
  onClose: undefined,
  className: '',
}
