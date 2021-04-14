import * as React from 'react'
import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Tooltip } from '../Tooltip'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

type StyledProps = Pick<BreadcrumbProps, 'maxWidth'>

const { states, typography } = tokens

const StyledTypography = styled(Typography)<StyledProps>`
  &:hover {
    text-decoration: underline;
    color: ${states.hover.typography.color};
  }
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-decoration: none;
  color: ${typography.color};
  ${({ maxWidth }) => css({ maxWidth })}
`

type BreadcrumbProps = {
  /* Max label width in pixels,
   * truncate long labels based on this width */
  maxWidth?: number
  /** click handler function */
  onClick?: (e: MouseEvent | KeyboardEvent) => void
  /** Children is breadcrumb text */
  children: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Breadcrumb = forwardRef<HTMLAnchorElement, BreadcrumbProps>(
  function Breadcrumb({ children, maxWidth, ...other }, ref) {
    const props = {
      ...other,
      ref,
      maxWidth,
    }
    const showTooltip = maxWidth > 0

    return showTooltip ? (
      <Tooltip title={children} placement="top">
        <StyledTypography link variant="body_short" {...props}>
          {children}
        </StyledTypography>
      </Tooltip>
    ) : (
      <StyledTypography link variant="body_short" {...props}>
        {children}
      </StyledTypography>
    )
  },
)

// Breadcrumb.displayName = 'eds-breadcrumb'
