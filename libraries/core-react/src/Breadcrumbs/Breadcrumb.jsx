import React, { forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

const StyleTypography = styled(Typography)`
  text-decoration: none;
  color: ${tokens.colors.enabled};
  &:hover {
    text-decoration: underline;
    color: ${tokens.colors.hover};
  }
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus {
    outline: ${tokens.outline};
    outline-offset: 6px;
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

  return (
    <StyleTypography link variant="body_short" {...props}>
      {children}
    </StyleTypography>
  )
})

Breadcrumb.displayName = 'eds-breadcrumb'

Breadcrumb.propTypes = {
  // click handler function
  onClick: PropTypes.func,
  // Breadcrumb children
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumb.defaultProps = {
  className: '',
  onClick: () => {},
}
