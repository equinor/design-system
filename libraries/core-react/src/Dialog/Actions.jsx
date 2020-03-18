import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { spacingsTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const { spacingsActions } = tokens

const StyledActions = styled.div`
  justify-content: end;
  justify-self: end;
  min-height: 48px;
  padding-left: 16px;
  padding-right: 16px;

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

export const Actions = forwardRef(function EdsDialogActions(
  { children, ...props },
  ref,
) {
  return (
    <StyledActions ref={ref} {...props}>
      {children}
    </StyledActions>
  )
})

Actions.displayName = 'eds-dialog-actions'

Actions.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Actions.defaultProps = {
  className: undefined,
  children: undefined,
}
