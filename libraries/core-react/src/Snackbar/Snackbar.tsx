import { useState, useEffect, HTMLAttributes, FC } from 'react'
import styled from 'styled-components'
import { snackbar as tokens } from './Snackbar.tokens'
import { typographyTemplate } from '../_common/templates'

type StyledProps = {
  leftAlignFrom: string
} & HTMLAttributes<HTMLDivElement>

const StyledSnackbar = styled.div.attrs(() => ({
  role: 'alert',
}))<StyledProps>`
  position: fixed;
  left: ${tokens.spacings.left};
  bottom: ${tokens.spacings.bottom};
  background-color: ${tokens.background};
  padding: ${tokens.spacings.padding};
  border-radius: ${tokens.borderRadius};
  ${typographyTemplate(tokens.text.typography)}
  color: ${tokens.text.color};
  box-shadow: ${tokens.boxShadow};
  min-height: ${tokens.minHeight};
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  @media (min-width: ${({ leftAlignFrom }) => leftAlignFrom}) {
    left: auto;
    transform: none;
  }

  a,
  button {
    color: ${tokens.buttonColor}
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

export const Snackbar: FC<SnackbarProps> = ({
  open = false,
  autoHideDuration = 7000,
  onClose,
  leftAlignFrom = '1200px',
  children,
  className,
}) => {
  const [visible, setVisible] = useState(open)
  useEffect(() => {
    setVisible(open)
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) {
        onClose()
      }
    }, autoHideDuration)
    return () => clearTimeout(timer)
  }, [open])
  return (
    <>
      {visible && (
        <StyledSnackbar leftAlignFrom={leftAlignFrom} className={className}>
          {children}
        </StyledSnackbar>
      )}
    </>
  )
}

// Snackbar.displayName = 'Snackbar'
