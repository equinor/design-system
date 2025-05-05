import { forwardRef, ElementType, useMemo } from 'react'
import styled, { css } from 'styled-components'
import type { OverridableComponent } from '@equinor/eds-utils'
import { Typography } from '../Typography'
import { Tooltip } from '../Tooltip'
import { breadcrumbs as tokens } from './Breadcrumbs.tokens'

type StyledProps = { $maxWidth?: number }

const { states, typography } = tokens

const StyledTypography = styled(Typography)<StyledProps>`
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      text-decoration: underline;
      color: ${states.hover.typography.color};
      cursor: pointer;
    }
  }
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  line-height: 1;
  text-decoration: none;
  color: ${typography.color};
  width: 100%;
  ${({ $maxWidth }) => css({ maxWidth: $maxWidth })}
`
type OverridableSubComponent = OverridableComponent<
  BreadcrumbProps,
  HTMLAnchorElement
> & {
  displayName?: string
}

export type BreadcrumbProps = {
  /* Max label width in pixels,
   * truncate long labels based on this width */
  maxWidth?: number
  /** Children is breadcrumb text */
  children: string
  /** Always show tooltip */
  forceTooltip?: boolean
  /** Override element type */
  as?: ElementType
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Breadcrumb: OverridableSubComponent = forwardRef(
  function Breadcrumb(
    { children, maxWidth, forceTooltip, href, as, ...other },
    ref,
  ) {
    const props: React.ComponentProps<typeof StyledTypography> = {
      ...other,
      href,
      ref,
    }

    const showTooltip = maxWidth > 0 || forceTooltip
    const isHrefDefined = href !== undefined

    const forwardedAs: ElementType = useMemo(
      () => (as ? as : isHrefDefined ? 'a' : 'span'),
      [as, isHrefDefined],
    )

    const crumb = (
      <StyledTypography
        link={isHrefDefined}
        forwardedAs={forwardedAs}
        variant="body_short"
        $maxWidth={maxWidth}
        {...props}
      >
        {children}
      </StyledTypography>
    )

    return showTooltip ? (
      <Tooltip title={children} placement="top">
        {crumb}
      </Tooltip>
    ) : (
      crumb
    )
  },
)
