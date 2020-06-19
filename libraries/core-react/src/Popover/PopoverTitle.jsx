import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Divider } from '..'
import { typographyTemplate } from '../_common/templates'

import { popover as tokens } from './Popover.tokens'

const StyledPopoverTitle = styled.div`
  ${typographyTemplate(tokens.header)}
  margin-right: 48px;
  max-width: 498px;
  overflow: hidden;
`

const StyledDivider = styled((props) => <Divider {...props} />)`
  margin-left: -16px;
  margin-right: -16px;
  max-width: 560px;
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
    <div {...props}>
      <StyledPopoverTitle>{children}</StyledPopoverTitle>
      <StyledDivider variant="small" />
    </div>
  )
})

PopoverTitle.displayName = 'eds-popover-title'

PopoverTitle.propTypes = {
  /** Children for PopoverTitle is required (string) */
  children: PropTypes.string.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

PopoverTitle.defaultProps = {
  className: '',
}
