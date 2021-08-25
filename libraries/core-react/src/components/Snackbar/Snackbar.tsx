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

type StyledProps = {
  top: string
  bottom: string
  right: string
  left: string
}

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

  ${({ top, bottom, right, left }) =>
    css({
      top: top,
      left: left,
      right: right,
      bottom: bottom,
      transform:
        right === '50%' || left === '50%'
          ? 'translateX(-50%)'
          : top === '50%' || top === '50%'
          ? 'translateY(-50%)'
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
  /** Placement of the snackbar */
  placement?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'left-top'
    | 'left-bottom'
    | 'right-top'
    | 'right-bottom'
} & HTMLAttributes<HTMLDivElement>

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  function Snackbar(
    {
      open = false,
      autoHideDuration = 7000,
      onClose,
      placement = 'left-bottom',
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

    const top = placement.includes('top')
      ? tokens.spacings.top
      : placement === 'left' || placement === 'right'
      ? '50%'
      : undefined
    const bottom = placement.includes('bottom')
      ? tokens.spacings.bottom
      : undefined
    const right = placement.includes('right')
      ? tokens.spacings.right
      : undefined
    const left = placement.includes('left')
      ? tokens.spacings.left
      : placement === 'top' || placement === 'bottom'
      ? '50%'
      : undefined

    const props = {
      left,
      right,
      top,
      bottom,
      ref,
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
