import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Tooltip } from '../Tooltip'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

const StyleTypography = styled(Typography)`
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-decoration: none;
  color: ${tokens.colors.enabled};
  ${({ maxWidth }) => css({ maxWidth })}
`

export const Breadcrumb = forwardRef(function Breadcrumb(
  { className, children, maxWidth, ...rest },
  ref,
) {
  const props = {
    ...rest,
    className,
    ref,
    maxWidth: maxWidth,
  }

  const tooltip = Boolean(maxWidth)

  const WithTooltip = (
    <Tooltip title={children}>
      <StyleTypography role="breadcrumb" link variant="body_short" {...props}>
        {children}
      </StyleTypography>
    </Tooltip>
  )

  return tooltip ? (
    WithTooltip
  ) : (
    <StyleTypography role="breadcrumb" link variant="body_short" {...props}>
      {children}
    </StyleTypography>
  )
})

Breadcrumb.displayName = 'eds-breadcrumb'

Breadcrumb.propTypes = {
  /*
   * Max label width in pixels,
   * truncate long labels based on this width
   */
  maxWidth: PropTypes.number,
  // click handler function
  onClick: PropTypes.func,
  // Breadcrumb children
  children: PropTypes.node.isRequired,
  /** @ignore */
  className: PropTypes.string,
}

Breadcrumb.defaultProps = {
  maxWidth: undefined,
  className: '',
  onClick: () => {},
}
