import React, { forwardRef, FunctionComponent } from 'react'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  minHeight,
  width,
  title,
  boxShadow,
  background,
  borderRadius,
  spacingsMedium,
} = tokens

const StyledDialog = styled.div.attrs(() => ({
  tabIndex: 0,
  role: 'dialog',
  'aria-labelledby': 'eds-dialog-title',
  'aria-describedby': 'eds-dialog-customcontent',
  'aria-modal': true,
}))`
  width: ${width};
  /* min-height: ${minHeight}; */
  box-shadow: ${boxShadow};
  background: ${background};
  border-radius: ${borderRadius};
  display: grid;
  padding-top: ${spacingsMedium};

  ${typographyTemplate(title)}
`

type Props = React.HTMLAttributes<HTMLDivElement>

export const Dialog: FunctionComponent<Props> = forwardRef<
  HTMLDivElement,
  Props
>(function EdsDialog({ children, ...props }, ref) {
  return (
    <StyledDialog {...props} ref={ref}>
      {children}
    </StyledDialog>
  )
})

Dialog.displayName = 'eds-dialog'
