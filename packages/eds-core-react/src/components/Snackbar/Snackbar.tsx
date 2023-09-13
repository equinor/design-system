import { useState, useEffect, HTMLAttributes, forwardRef, useRef } from 'react'
import * as ReactDom from 'react-dom'
import { styled, css, ThemeProvider } from 'styled-components'
import { snackbar as SnackbarToken } from './Snackbar.tokens'
import {
  useToken,
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '@equinor/eds-utils'
import { Paper } from '../Paper'
import { useEds } from '../EdsProvider'

type StyledProps = Pick<SnackbarProps, 'placement'>

const StyledSnackbar = styled(Paper)<StyledProps>(({ theme, placement }) => {
  return css`
    position: fixed;
    background-color: ${theme.background};
    ${spacingsTemplate(theme.spacings)}
    ${bordersTemplate(theme.border)}
    ${typographyTemplate(theme.typography)}
    min-height: ${theme.minHeight};
    box-sizing: border-box;
    z-index: 1400;

    ${{
      top: placement.includes('top')
        ? theme.spacings.top
        : placement === 'left' || placement === 'right'
        ? '50%'
        : undefined,
      bottom: placement.includes('bottom') ? theme.spacings.bottom : undefined,
      right: placement.includes('right') ? theme.spacings.right : undefined,
      left: placement.includes('left')
        ? theme.spacings.left
        : placement === 'top' || placement === 'bottom'
        ? '50%'
        : undefined,
      transform:
        placement === 'left' || placement === 'right'
          ? 'translateY(-50%)'
          : placement === 'top' || placement === 'bottom'
          ? 'translateX(-50%)'
          : undefined,
    }}

    a,
    button {
      color: ${theme.entities.button.typography.color};
    }
  `
})

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
    const timer = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
      setVisible(open)

      timer.current = setTimeout(() => {
        setVisible(false)

        if (onClose) {
          onClose()
        }
      }, autoHideDuration)

      return () => clearTimeout(timer.current)
    }, [open, autoHideDuration, setVisible, onClose])

    const props = {
      ref,
      placement,
      ...rest,
    }
    const { density } = useEds()
    const token = useToken({ density }, SnackbarToken)

    return (
      <ThemeProvider theme={token}>
        {visible &&
          ReactDom.createPortal(
            <StyledSnackbar role="alert" elevation="overlay" {...props}>
              {children}
            </StyledSnackbar>,
            document.body,
          )}
      </ThemeProvider>
    )
  },
)
