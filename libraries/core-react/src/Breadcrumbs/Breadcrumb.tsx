import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Tooltip } from '../Tooltip'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

type StyledProps = Pick<Props, 'maxWidth'>

const StyledTypography = styled(Typography)<StyledProps>`
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

type Props = {
  /* Max label width in pixels,
   * truncate long labels based on this width */
  maxWidth?: number
  /* click handler function */
  onClick?: () => void
  /** Children is breadcrumb text */
  children: string
  /** Classname  */
  className?: string
}

export const Breadcrumb = forwardRef<HTMLDivElement, Props>(function Breadcrumb(
  { children, maxWidth, ...other },
  ref,
) {
  const props = {
    ...other,
    ref,
    maxWidth: maxWidth,
  }

  const tooltip = Boolean(maxWidth)

  const WithTooltip = (
    <Tooltip title={children}>
      <StyledTypography link variant="body_short" {...props}>
        {children}
      </StyledTypography>
    </Tooltip>
  )

  return tooltip ? (
    WithTooltip
  ) : (
    <StyledTypography link variant="body_short" {...props}>
      {children}
    </StyledTypography>
  )
})

Breadcrumb.displayName = 'eds-breadcrumb'
