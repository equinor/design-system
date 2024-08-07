import { useEffect, HTMLAttributes, forwardRef, useRef, useState } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { snackbar as SnackbarToken } from './Snackbar.tokens'
import {
  useToken,
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '@equinor/eds-utils'
import { Paper } from '../Paper'
import { useEds } from '../EdsProvider'

type StyledProps = {
  popover: string
  $placement?:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'top-left'
    | 'bottom-left'
    | 'top-right'
    | 'bottom-right'
}

const PopoverDiv = styled('div').withConfig({
  shouldForwardProp: () => true, //workaround to avoid warning until popover gets added to react types
})<StyledProps>(({ theme, $placement }) => {
  return css`
    inset: unset;
    border: 0;
    overflow: visible;
    position: fixed;
    padding: 0;
    background-color: transparent;
    ${{
      top: $placement.includes('top')
        ? theme.spacings.top
        : $placement === 'left' || $placement === 'right'
          ? '50%'
          : undefined,
      bottom: $placement.includes('bottom') ? theme.spacings.bottom : undefined,
      right: $placement.includes('right') ? theme.spacings.right : undefined,
      left: $placement.includes('left')
        ? theme.spacings.left
        : $placement === 'top' || $placement === 'bottom'
          ? '50%'
          : undefined,
      transform:
        $placement === 'left' || $placement === 'right'
          ? 'translateY(-50%)'
          : $placement === 'top' || $placement === 'bottom'
            ? 'translateX(-50%)'
            : undefined,
    }}
    &::backdrop {
      background-color: transparent;
    }
  `
})

const StyledSnackbar = styled(Paper)(({ theme }) => {
  return css`
    background-color: ${theme.background};
    ${spacingsTemplate(theme.spacings)}
    ${bordersTemplate(theme.border)}
    ${typographyTemplate(theme.typography)}
    min-height: ${theme.minHeight};
    box-sizing: border-box;
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
      if (open) {
        timer.current = setTimeout(() => {
          setVisible(false)
          if (onClose) {
            onClose()
          }
        }, autoHideDuration)
      }
      return () => clearTimeout(timer.current)
    }, [open, setVisible, autoHideDuration, onClose])

    const props = {
      ref,
      ...rest,
    }
    const { density } = useEds()
    const token = useToken({ density }, SnackbarToken)

    return (
      <ThemeProvider theme={token}>
        {visible && (
          <PopoverDiv
            popover="manual"
            $placement={placement}
            ref={(el) => el?.showPopover()}
          >
            <StyledSnackbar role="alert" elevation="overlay" {...props}>
              {children}
            </StyledSnackbar>
          </PopoverDiv>
        )}
      </ThemeProvider>
    )
  },
)
