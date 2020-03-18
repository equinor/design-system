import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  minHeight,
  width,
  title: { text },
  boxShadow,
  background,
  borderRadius,
} = tokens

const StyledDialog = styled.div`
  width: ${width};
  min-height: ${minHeight};
  box-shadow: ${boxShadow};
  background: ${background};
  border-radius: ${borderRadius};
  grid-template-rows: 24px auto 60px;

  ${typographyTemplate(text)}
`

export const Dialog = forwardRef(function EdsDialog(
  { children, ...props },
  ref,
) {
  return (
    <StyledDialog
      tabindex="0"
      role="dialog"
      ariaLabelledBy="eds-dialog-title"
      ariaDescribedBy="eds-dialog-customcontent"
      ariaModal="true"
      {...props}
      ref={ref}
    >
      {children}
    </StyledDialog>
  )
})

Dialog.displayName = 'eds-dialog'

Dialog.propTypes = {
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  children: PropTypes.node,
}

Dialog.defaultProps = {
  className: '',
  children: undefined,
}
