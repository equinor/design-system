import React, { useEffect, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon, Card, Button } from '..'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'

import { popover as tokens } from './Popover.tokens'

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
  ${({ top, bottom, right, left }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
    `}
  width: ${tokens.arrow.width};
  height: ${tokens.arrow.height};
  position: absolute;
  fill: ${tokens.background};
  filter: drop-shadow(-4px 0px 2px rgba(0,0,0,0.2));
`

const StyledCloseButton = styled((props) => <Button {...props} />)`
  position: absolute;
  top: 8px;
  right: 16px;
  height: 32px;
  width: 32px;
  &:after {
    height: 32px;
  }
`

export const PopoverItem = forwardRef(function EdsPopoverItem(
  { children, onClose, anchorRef, placement, className, ...rest },
  ref,
) {
  const wrapperProps = {
    ...rest,
    className,
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
  }

  const contRef = useRef(ref)
  const svgTransform = tokens.placement[placement].arrowTransform

  const handleClose = (event) => {
    const popoverRef = contRef.current
    const anchRef = anchorRef.current
    const targetRef = event.target
    const popoverOpen = Boolean(popoverRef)

    if (event && popoverOpen) {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.type === 'click') {
        if (!popoverRef.contains(targetRef) && !anchRef.contains(targetRef)) {
          onClose()
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleClose, false)
    document.addEventListener('click', handleClose, false)

    return () => {
      document.removeEventListener('keydown', handleClose, false)
      document.removeEventListener('click', handleClose, false)
    }
  }, [])

  return (
    <StyledPopoverWrapper ref={contRef} {...wrapperProps}>
      <StyledPopover>
        <PopoverArrow {...arrowProps} transform={svgTransform}>
          <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
        </PopoverArrow>
        {children}
        <StyledCloseButton onClick={onClose} variant="ghost_icon">
          <Icon name="close" title="close" size={48} />
        </StyledCloseButton>
      </StyledPopover>
    </StyledPopoverWrapper>
  )
})

PopoverItem.displayName = 'eds-popover-item'

PopoverItem.propTypes = {
  // PopoverItem placement relative to anchor
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
  // Reference to anchor / trigger element
  anchorRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  /**  @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PopoverItem.defaultProps = {
  placement: 'bottom',
  onClose: undefined,
  children: undefined,
  className: '',
}
