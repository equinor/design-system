import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const {
  title: { typography },
  spacingsMedium,
} = tokens

const StyledTitle = styled.div`
  ${typographyTemplate(typography)}

  min-height: 24px;
  align-self: end;
  justify-self: start;
  padding: 0 ${spacingsMedium};

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-bottom: ${spacingsMedium};
`

export const Title = forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function EdsDialogTitle({ children, ...rest }, ref) {
    return (
      <Fragment>
        <StyledTitle id="eds-dialog-title" ref={ref} {...rest}>
          {children}
        </StyledTitle>
        {children && <StyledDivider color="medium" variant="small" />}
      </Fragment>
    )
  },
)

Title.displayName = 'eds-dialog-title'

Title.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

Title.defaultProps = {
  className: undefined,
  children: undefined,
}
