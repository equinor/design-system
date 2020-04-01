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
  padding: ${spacingsMedium} 0 0 0;

  ${typographyTemplate(text)}
`

export const Dialog = forwardRef(function EdsDialog(
  { children, ...props },
  ref,
) {
  return (
    <StyledDialog {...props} ref={ref}>
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
