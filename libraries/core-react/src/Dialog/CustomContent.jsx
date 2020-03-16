import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { dialog as tokens } from './Dialog.tokens'
import { spacingsTemplate, typographyTemplate } from '../_common/templates'

import styled from 'styled-components'

const {
  description: { text },
  spacingsContent,
} = tokens

const StyledCustomContent = styled.div`
  /* grid-area: center; */
  height: 56px;
  margin-bottom: 16px;
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
  scrollable: PropTypes.boolean,
}

CustomContent.defaultProps = {
  className: undefined,
  children: undefined,
  scrollable: false,
}
