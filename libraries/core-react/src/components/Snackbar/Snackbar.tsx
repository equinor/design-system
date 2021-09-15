import { useState, useEffect, HTMLAttributes, forwardRef, useRef } from 'react'
import * as ReactDom from 'react-dom'
import styled, { css } from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Paper } from '../Paper'

type StyledProps = Pick<SnackbarProps, 'placement'>

const StyledSnackbar = styled(Paper).attrs<StyledProps>(() => ({
  role: 'alert',
}))<StyledProps>`
  position: fixed;
  background-color: ${tokens.background};
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}
  ${typographyTemplate(tokens.typography)}
  min-height: ${tokens.minHeight};
  box-sizing: border-box;
  z-index: 300;

  ${({ placement }) =>
    css({
      top: placement.includes('top')
        ? tokens.spacings.top
        : placement === 'left' || placement === 'right'
        ? '50%'
        : undefined,
      bottom: placement.includes('bottom') ? tokens.spacings.bottom : undefined,
      right: placement.includes('right') ? tokens.spacings.right : undefined,
      left: placement.includes('left')
        ? tokens.spacings.left
        : placement === 'top' || placement === 'bottom'
        ? '50%'
        : undefined,
      transform:
        placement === 'left' || placement === 'right'
          ? 'translateY(-50%)'
          : placement === 'top' || placement === 'bottom'
          ? 'translateX(-50%)'
          : undefined,
    })}
  a,
  button {
    color: ${tokens.entities.button.typography.color};
  }
`

export type SnackbarProps = {
  /**  Controls the visibility of the snackbar */
  open?: boolean
  /** How long will the message be visible in milliseconds */
  autoHideDuration?: number
  /** Callback fired when the snackbar is closed by auto hide duration timeout */
  onClose?: () => void
  /** Placement of the snackbar relative to the viewport */
  placement?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'bottom-left'
    | 'top-right'
    | 'bottom-right'
} & HTMLAttributes<HTMLDivElement>

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  function Snackbar(
    {
      open = false,
      autoHideDuration = 7000,
      onClose,
      placement = 'bottom',
      children,
      ...rest
    },
    ref,
  ) {
    const [visible, setVisible] = useState(open)
    const timer = useRef<number>()
    const { setTimeout, clearTimeout } = window

    useEffect(() => {
      setVisible(open)

      timer.current = setTimeout(() => {
        setVisible(false)

        if (onClose) {
          onClose()
        }
      }, autoHideDuration)

      return () => clearTimeout(timer.current)
    }, [open, autoHideDuration, setVisible, onClose, clearTimeout, setTimeout])

    const props = {
      ref,
      placement,
      ...rest,
    }
    return (
      <>
        {visible &&
          ReactDom.createPortal(
            <StyledSnackbar elevation="overlay" {...props}>
              {children}
            </StyledSnackbar>,
            document.body,
          )}
      </>
    )
  },
)
