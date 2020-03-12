import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const { spacings } = tokens

const StyledActions = styled.div`
  align-items: end;
  align-content: flex-end;
  justify-content: end;
  justify-self: end;
  ${spacingsTemplate(spacings)};
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
