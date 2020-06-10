import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@equinor/eds-core-react'
import styled, { css } from 'styled-components'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

const StyledTypography = styled(Typography)`
  text-decoration: none;
  color: ${tokens.colors.enabled};
  &:hover {
    text-decoration: underline;
    color: ${tokens.colors.hover};
  }
  &[data-focus-visible-added]:focus {
    padding: ${tokens.borderTokens.paddingX} ${tokens.borderTokens.paddingY};
    border: ${tokens.border};
  }
`

export const Breadcrumb = forwardRef(function Breadcrumb(
  { className, children, onClick, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
  }

  return <StyledTypography link>{children}</StyledTypography>
})

Breadcrumb.displayName = 'eds-breadcrumb'

Breadcrumb.propTypes = {
  // click handler function
  onClick: PropTypes.func,
  // Breadcrumb children (string)
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumb.defaultProps = {
  className: '',
  onClick: () => {},
}
