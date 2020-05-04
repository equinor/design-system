import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { dialog as tokens } from './Dialog.tokens'

const { spacingsMedium } = tokens

const StyledActions = styled.div`
  min-height: 48px;
  padding: 0 ${spacingsMedium};
  align-self: end;
  justify-self: start;

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

export const Actions = forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function EdsDialogActions({ children, ...rest }, ref) {
    return (
      <StyledActions ref={ref} {...rest}>
        {children}
      </StyledActions>
    )
  },
)

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
