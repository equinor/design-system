import React, { forwardRef, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '../_common/templates'

import { dialog as tokens } from './Dialog.tokens'

const {
  description: { typography },
  spacingsMedium,
} = tokens

const StyledCustomContent = styled.div`
  ${typographyTemplate(typography)}

  min-height: 80px;
  margin-bottom: ${spacingsMedium};
  align-self: stretch;
  justify-self: stretch;
  padding: 0 ${spacingsMedium};

  ${({ scrollable }) =>
    scrollable &&
    css`
      min-height: initial;
      height: 104px;
      overflow-y: auto;
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-top: 0;
  margin-bottom: ${spacingsMedium};
`

/**
 * @typedef Props
 * @prop {boolean} [scrollable]
 */

export const CustomContent = forwardRef(
  /**
   * @param {Props & React.HTMLAttributes<HTMLDivElement>} props
   * @param ref
   */
  function EdsDialogCustomContent({ children, ...rest }, ref) {
    return (
      <Fragment>
        <StyledCustomContent id="eds-dialog-customcontent" ref={ref} {...rest}>
          {children}
        </StyledCustomContent>

        {children && rest.scrollable && (
          <StyledDivider color="medium" variant="small" />
        )}
      </Fragment>
    )
  },
)

CustomContent.displayName = 'eds-dialog-customcontent'

CustomContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  scrollable: PropTypes.bool,
}

CustomContent.defaultProps = {
  className: undefined,
  children: undefined,
  scrollable: false,
}
