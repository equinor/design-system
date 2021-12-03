import { forwardRef } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { Paper } from '../Paper'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledDialog = styled(Paper).attrs<DialogProps>(({ theme }) => ({
  theme,
  tabIndex: 0,
  role: 'dialog',
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
  'aria-modal': true,
}))`
  width: ${dialogToken.width};
  background: ${dialogToken.background};
  display: grid;
  ${typographyTemplate(dialogToken.typography)}
  ${spacingsTemplate(dialogToken.spacings)}
  ${bordersTemplate(dialogToken.border)}
`

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
