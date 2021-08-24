import { useState, useEffect, HTMLAttributes, forwardRef, useRef } from 'react'
import * as ReactDom from 'react-dom'
import styled, { css } from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Placement } from '../../hooks'
import { Paper } from '../Paper'

type StyledProps = {
  placement: string
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
  //transform: translateX(-50%);
  z-index: 300;

  ${({ placement }) =>
    css({
      left: [
        'left',
        'left-start',
        'left-end',
        'bottom-start',
        'top-start',
      ].some((el) => placement.includes(el))
        ? tokens.spacings.left
        : undefined,
      right: [
        'right',
        'right-start',
        'right-end',
        'bottom-end',
        'top-end',
      ].some((el) => placement.includes(el))
        ? tokens.spacings.right
        : undefined,
      top: ['top', 'top-start', 'top-end'].some((el) => placement.includes(el))
        ? tokens.spacings.top
        : undefined,
      bottom: ['bottom', 'bottom-start', 'bottom-end'].some((el) =>
        placement.includes(el),
      )
        ? tokens.spacings.bottom
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
  placement?: Placement
} & HTMLAttributes<HTMLDivElement>

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  function Snackbar(
    {
      open = false,
      autoHideDuration = 7000,
      onClose,
      placement = 'auto',
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
      placement,
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
