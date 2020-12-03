/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react'
import { useEffect, useRef, forwardRef, HTMLAttributes, SVGProps } from 'react'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { Card } from '../Card'
import { Button } from '../Button'
import { close } from '@equinor/eds-icons'
import { spacingsTemplate, typographyTemplate } from '@utils'
import { useCombinedRefs } from '@hooks'

import { popover as tokens, Placement } from './Popover.tokens'

type WrapperProps = {
  top: string | number
  bottom: string | number
  right: string | number
  left: string | number
  transform: string
}

const StyledPopoverWrapper = styled.div<WrapperProps>`
  ${({ top, bottom, right, left, transform }) =>
    css`
      bottom: ${bottom};
      top: ${top};
      right: ${right};
      left: ${left};
      transform: ${transform};
    `}
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
  max-height: ${tokens.popover.maxHeight};
  max-width: ${tokens.popover.maxWidth};
  min-height: ${tokens.popover.minHeight};
  box-shadow: ${tokens.elevation};
`

type ArrowProps = {
  top: string
  bottom: string
  right: string
  left: string
} & SVGProps<SVGSVGElement>

const PopoverArrow = styled.svg<ArrowProps>`
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

type PopoverItemProps = {
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
  /** Anchor reference */
  anchorRef: React.MutableRefObject<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement>

export const PopoverItem = forwardRef<HTMLDivElement, PopoverItemProps>(
  function PopoverItem(
    {
      children,
      onClose = () => {},
      anchorRef,
      placement = 'bottom',
      className,
      ...rest
    },
    ref,
  ) {
    const placementToken: Placement = tokens.placement[placement]

    const wrapperProps = {
      ...rest,
      className,
      right: placementToken.popoverRight,
      top: placementToken.popoverTop,
      bottom: placementToken.popoverBottom,
      left: placementToken.popoverLeft,
      transform: placementToken.transform,
    }

    const arrowProps = {
      left: placementToken.arrowLeft,
      right: placementToken.arrowRight,
      top: placementToken.arrowTop,
      bottom: placementToken.arrowBottom,
    }

    const contRef = useRef<HTMLDivElement>(null)
    const svgTransform = placementToken.arrowTransform

    const handleKeyboardClose = (event: KeyboardEvent) => {
      const popoverRef = contRef.current
      const popoverOpen = Boolean(popoverRef)

      if (event && popoverOpen) {
        if (event.key === 'Escape') {
          onClose()
        }
      }
    }

    const handleClickClose = (event: MouseEvent) => {
      const popoverRef = contRef.current
      const anchRef = anchorRef.current
      const targetRef = event.target
      const popoverOpen = Boolean(popoverRef)

      if (event && popoverOpen) {
        if (event.type === 'click') {
          if (
            !popoverRef.contains(targetRef as Node) &&
            !anchRef.contains(targetRef as Node)
          ) {
            onClose()
          }
        }
      }
    }

    useEffect(() => {
      document.addEventListener('keydown', handleKeyboardClose, false)
      document.addEventListener('click', handleClickClose, false)

      return () => {
        document.removeEventListener('keydown', handleKeyboardClose, false)
        document.removeEventListener('click', handleClickClose, false)
      }
    }, [])

    return (
      <StyledPopoverWrapper
        ref={useCombinedRefs(ref, contRef)}
        {...wrapperProps}
      >
        <StyledPopover>
          <PopoverArrow {...arrowProps} transform={svgTransform}>
            <path d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z" />
          </PopoverArrow>
          {children}
          <StyledCloseButton onClick={onClose} variant="ghost_icon">
            <Icon name="close" data={close} title="close" size={48} />
          </StyledCloseButton>
        </StyledPopover>
      </StyledPopoverWrapper>
    )
  },
)

// PopoverItem.displayName = 'eds-popover-item'
