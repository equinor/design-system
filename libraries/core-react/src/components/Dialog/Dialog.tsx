import { forwardRef } from 'react'
import styled from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
} from '../../utils'
import { dialog as tokens } from './Dialog.tokens'
import { Paper } from '../Paper'

const StyledDialog = styled(Paper).attrs<DialogProps>(() => ({
  tabIndex: 0,
  role: 'dialog',
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
  'aria-modal': true,
}))`
  width: ${tokens.width};
  background: ${tokens.background};
  display: grid;
  ${typographyTemplate(tokens.typography)}
  ${spacingsTemplate(tokens.spacings)}
  ${bordersTemplate(tokens.border)}
`

export type DialogProps = React.HTMLAttributes<HTMLDivElement>

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { children, ...props },
  ref,
) {
  return (
    <StyledDialog elevation="above_scrim" {...props} ref={ref}>
      {children}
    </StyledDialog>
  )
})

// Dialog.displayName = 'EdsDialog'
