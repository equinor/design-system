import React, { forwardRef, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon, Card, Button } from '@equinor/eds-core-react'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { popover as tokens } from './Popover.tokens'

const Container = styled.div`
  position: relative;
  display: flex;
  width: auto;
  justify-content: center;
`

const StyledPopoverWrapper = styled.div`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
  width: max-content;
  position: absolute;
  z-index: 500;
  align-self: center;
  flex-shrink: 0;
  ::after {
    content: '';
  }
`

const StyledPopover = styled((props) => <Card {...props} />)`
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  background: ${tokens.background};
  fill: ${tokens.background};
  max-height: ${tokens.popover.maxHeight};
  max-width: ${tokens.popover.maxWidth};
  min-height: ${tokens.popover.minHeight};
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14);
`

const PopoverArrow = styled.svg`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: ${tokens.background};
  filter: drop-shadow(-4px 0px 2px rgba(0,0,0,0.2));
`

const StyledCloseButton = styled((props) => <Button {...props} />)`
  position: absolute;
  top: 0;
  right: 16px;
`

function outsideClickListener(ref, onClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      console.log(event, ref, ref.current, event.target)
      if (ref.current && !ref.current.contains(event.target)) {
        // User clicked outside popover
        onClose()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref])
}

export const Popover = forwardRef(function Popover(
  { className, open, onClose, children, placement, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  const handleClose = (event) => {
    if (event) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.type === 'click') {
        onClose()
      }
    }
  }

  const handleContentClick = (event) => {
    // Avoid event bubbling inside dialog/content inside scrim
    event.stopPropagation()
  }

  useEffect(() => {
    document.addEventListener('keydown', handleClose, false)

    return () => {
      document.removeEventListener('keydown', handleClose, false)
    }
  }, [])

  const wrapperProps = {
    right: tokens.placement[placement].popoverRight,
    top: tokens.placement[placement].popoverTop,
    bottom: tokens.placement[placement].popoverBottom,
    left: tokens.placement[placement].popoverLeft,
    transform: tokens.placement[placement].transform,
  }

  const arrowProps = {
    left: tokens.placement[placement].arrowLeft,
    right: tokens.placement[placement].arrowRight,
    top: tokens.placement[placement].arrowTop,
    bottom: tokens.placement[placement].arrowBottom,
    transform: tokens.placement[placement].arrowTransform,
  }

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

  const contRef = useRef(null)
  outsideClickListener(contRef, onClose)

  return (
    <div ref={contRef}>
      <Container {...props}>
        {anchorElement}
        {open && (
          <StyledPopoverWrapper {...wrapperProps}>
            <StyledPopover>
              <PopoverArrow {...arrowProps}>
                <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
              </PopoverArrow>
              {childArray}
              <StyledCloseButton onClick={onClose} variant="ghost_icon">
                <Icon name="close" title="close" size={48} />
              </StyledCloseButton>
            </StyledPopover>
          </StyledPopoverWrapper>
        )}
      </Container>
    </div>
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
  open: PropTypes.bool,
  /** Popover reference/anchor element is required as a child */
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Popover.defaultProps = {
  placement: 'bottom',
  open: false,
  onClose: undefined,
  children: undefined,
  className: '',
}
