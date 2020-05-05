import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Divider } from '@equinor/eds-core-react'
import { typographyTemplate } from '../_common/templates'

import { popover as tokens } from './Popover.tokens'

const StyledPopoverTitle = styled.div`
  ${typographyTemplate(tokens.header)}
`

const StyledDivider = styled((props) => <Divider {...props} />)`
  margin-left: -16px;
  margin-right: -16px;
`

export const PopoverTitle = forwardRef(function EdsPopoverTitle(
  { children, className, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return (
    <StyledPopoverTitle {...props}>
      {children}
      <StyledDivider variant="small" />
    </StyledPopoverTitle>
  )
})

PopoverTitle.displayName = 'eds-popover-title'

PopoverTitle.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

PopoverTitle.defaultProps = {
  className: '',
  children: undefined,
}
