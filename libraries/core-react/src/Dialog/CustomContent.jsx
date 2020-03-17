import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'

import { dialog as tokens } from './Dialog.tokens'

const {
  description: { text },
  spacingsContent,
} = tokens

const StyledCustomContent = styled.div`
  /* grid-area: center; */
  display: inline-block;
  height: 56px;
  margin-bottom: 12px;
  overflow-y: auto;

  ${spacingsTemplate(spacingsContent)};
  ${typographyTemplate(text)}
`

export const CustomContent = forwardRef(function EdsDialogCustomContent(
  { children, ...props },
  ref,
) {
  return (
    <StyledCustomContent id="eds-dialog-customcontent" ref={ref} {...props}>
      {children}
    </StyledCustomContent>
  )
})

CustomContent.displayName = 'eds-dialog-customcontent'

CustomContent.propTypes = {
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
  /** @ignore */
  scrollable: PropTypes.bool,
  /** @ignore */
  size: PropTypes.oneOf(['normal', 'large']),
}

CustomContent.defaultProps = {
  className: undefined,
  children: undefined,
  scrollable: false,
  size: 'normal',
}
