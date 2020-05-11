import React, { forwardRef, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { PopoverItem } from './PopoverItem'

const Container = styled.div`
  position: relative;
  display: flex;
  width: auto;
  justify-content: center;
`

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
  let childArray = []
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      /* 
      Find anchor element in children to wrap the element together with Popover.
      Children is required, but user has to wrap the actual anchor with <PopoverAnchor />
      */
      if (children[i].type.displayName === 'eds-popover-anchor') {
        anchorElement = children[i]
      } else {
        // Push the remaining children to a new array to display as normal
        childArray.push(children[i])
      }
    }
  } else {
    if (children.type.displayName === 'eds-popover-anchor') {
      anchorElement = children
    }
  }

  return (
    <Container {...props}>
      <div ref={anchorRef}>{anchorElement}</div>
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
  // Open=true activates popup
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
