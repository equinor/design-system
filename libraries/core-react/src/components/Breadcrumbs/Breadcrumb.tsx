import * as React from 'react'
import { useRef, forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Typography } from '../Typography'
import { Tooltip } from '../Tooltip'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'
import { outlineTemplate } from '@utils'

type StyledProps = Pick<BreadcrumbProps, 'maxWidth'>

const { states, typography } = tokens

const StyledTypography = styled(Typography)<StyledProps>`
  &:hover {
    text-decoration: underline;
    color: ${states.hover.typography.color};
  }
  &:focus {
    outline: none;
  }
  &[data-focus-visible-added]:focus {
    ${outlineTemplate(states.focus.outline)}
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
    const [openTooltip, setopenTooltip] = React.useState(false)

    const handleOpen = () => {
      setopenTooltip(true)
    }

    const handleClose = () => {
      setopenTooltip(false)
    }
    const linkRef = useRef(null)
    const props = {
      ...other,
      ref,
      maxWidth: maxWidth,
    }

    const tooltip = Boolean(maxWidth)

    const WithTooltip = (
      <StyledTypography
        link
        variant="body_short"
        {...props}
        ref={linkRef}
        aria-describedby="tooltip"
        onMouseEnter={handleOpen}
        onFocus={handleOpen}
        onBlur={handleClose}
        onMouseLeave={handleClose}
      >
        {children}
        <Tooltip
          title={children}
          open={openTooltip}
          id="tooltip"
          placement="top"
          anchorEl={linkRef.current}
        />
      </StyledTypography>
    )

    return tooltip ? (
      WithTooltip
    ) : (
      <StyledTypography link variant="body_short" {...props}>
        {children}
      </StyledTypography>
    )
  },
)

// Breadcrumb.displayName = 'eds-breadcrumb'
