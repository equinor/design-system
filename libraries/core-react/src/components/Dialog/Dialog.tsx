import { forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Paper } from '../Paper'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledDialog = styled(Paper).attrs<DialogProps>({
  tabIndex: 0,
  role: 'dialog',
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
  'aria-modal': true,
})(({ theme }) => {
  return css`
    width: ${theme.width};
    background: ${theme.background};
    display: grid;
    ${typographyTemplate(theme.typography)}
    ${spacingsTemplate(theme.spacings)}
  ${bordersTemplate(theme.border)}
  `
})

export type DialogProps = React.HTMLAttributes<HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { children, ...props },
  ref,
) {
  const { density } = useEds()
  const token = useToken({ density }, dialogToken)

  return (
    <ThemeProvider theme={token}>
      <StyledDialog elevation="above_scrim" {...props} ref={ref}>
        {children}
      </StyledDialog>
    </ThemeProvider>
  )
})

// Dialog.displayName = 'EdsDialog'
