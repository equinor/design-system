import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { typographyTemplate } from '../_common/templates'

import { topbar as tokens } from './TopBar.tokens'

const {
  title: { text },
} = tokens

const StyledCardHeader = styled.div`
  grid-area: top;
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 24px;
  align-items: center;
  ${typographyTemplate(text)}
`

export const CardHeader = forwardRef(function EdsTopBarCardHeader(
  { children, ...props },
  ref,
) {
  return (
    <StyledCardHeader ref={ref} {...props}>
      {children}
    </StyledCardHeader>
  )
})

CardHeader.displayName = 'eds-topbar-header'

CardHeader.propTypes = {
  // Title:
  title: PropTypes.string,
  // Subtitle:
  subtitle: PropTypes.string,
  // Avatar:
  avatar: PropTypes.node,
  // Metadata (tags, badges, free text):
  meta: PropTypes.node,
  /** @ignore */
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
}

CardHeader.defaultProps = {
  title: '',
  subtitle: '',
  avatar: undefined,
  meta: undefined,
  className: undefined,
  children: undefined,
}
