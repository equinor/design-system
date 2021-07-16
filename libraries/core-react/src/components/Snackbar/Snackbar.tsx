import { useState, useEffect, HTMLAttributes, forwardRef, useRef } from 'react'
import * as ReactDom from 'react-dom'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Paper } from '../Paper'

type StyledProps = {
  leftAlignFrom: string
}

const StyledSnackbar = styled(Paper).attrs<StyledProps>(() => ({
  role: 'alert',
}))<StyledProps>`
  position: fixed;
  left: ${tokens.spacings.left};
  bottom: ${tokens.spacings.bottom};
  background-color: ${tokens.background};
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}
  ${typographyTemplate(tokens.typography)}
  min-height: ${tokens.minHeight};
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  @media (min-width: ${({ leftAlignFrom }) => leftAlignFrom}) {
    left: auto;
    transform: none;
  }

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
  /** Media query from which the snackbar will be horizontal centered */
  leftAlignFrom?: string
} & HTMLAttributes<HTMLDivElement>

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  function Snackbar(
    {
      open = false,
      autoHideDuration = 7000,
      onClose,
      leftAlignFrom = '1200px',
      children,
      className,
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
    }, [open])

    return (
      <>
        {visible &&
          ReactDom.createPortal(
            <StyledSnackbar
              elevation="overlay"
              leftAlignFrom={leftAlignFrom}
              className={className}
              ref={ref}
              {...rest}
            >
              {children}
            </StyledSnackbar>,
            document.body,
          )}
      </>
    )
  },
)
