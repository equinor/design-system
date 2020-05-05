import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import {
  Typography,
  Divider,
  Icon,
  Card,
  Button,
} from '@equinor/eds-core-react'
import { close } from '@equinor/eds-icons'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'
import { popover as tokens } from './Popover.tokens'

const Anchor = styled.div`
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
  width: auto;
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
  /* box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.2), 0px 4px 5px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.14); */
`

const StyledCloseButton = styled((props) => <Button {...props} />)`
  position: absolute;
  top: 0;
  right: 16px;
`

export const Popover = forwardRef(function Popover(
  { className, open, onClose, children, placement, anchorEl, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

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

  /* 
  Find anchor element in children to wrap the element together with Popover.

  Children is required, but user has to wrap the actual anchor with <PopoverAnchor />
  for this to work. 
  */
  let anchorElement
  let childArray = []
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
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
    <Anchor {...props}>
      {anchorElement}
      {open && (
        <StyledPopoverWrapper {...wrapperProps}>
          <StyledPopover>
            <PopoverArrow {...arrowProps}>
              <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
            </PopoverArrow>
            <StyledCloseButton onClick={onClose} variant="ghost_icon">
              <Icon name="close" title="close" size={48} />
            </StyledCloseButton>
            {childArray}
          </StyledPopover>
        </StyledPopoverWrapper>
      )}
    </Anchor>
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
