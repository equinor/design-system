import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  height,
  width,
  title: { text },
  boxShadow,
  background,
  borderRadius,
} = tokens

const StyledDialog = styled.div`
  width: ${width};
  height: ${height};
  box-shadow: ${boxShadow};
  background: ${background};
  border-radius: ${borderRadius};

  ${typographyTemplate(text)}
`

export const Dialog = forwardRef(function EdsDialog(
  { children, ...props },
  ref,
) {
  return (
    <StyledDialog
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
