import { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { List } from '../List'
import { Typography } from '../Typography'
import { typographyTemplate } from '../../utils'
import { tableOfContents as tokens } from './TableOfContents.tokens'

export type TableOfContentsProps = {
  /** Sticky functionality */
  sticky?: boolean
  /** Label or title for the ToC */
  label?: string
} & HTMLAttributes<HTMLElement>

const StyledTableOfContents = styled.nav<TableOfContentsProps>`
  margin-top: ${tokens.spacings.top};
  margin-bottom: ${tokens.spacings.bottom};

  ${({ sticky }) =>
    sticky &&
    css`
      position: fixed;
      top: ${tokens.entities.sticky.spacings.top};
      right: ${tokens.entities.sticky.spacings.bottom};
    `}
`

const TocList = styled(List)`
  margin: 0;
  padding: 0;
`

const TocLabel = styled(Typography)`
  ${typographyTemplate(tokens.typography)}
`

const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  function TableOfContents(
    { children, sticky = false, label = '', className, ...rest },
    ref,
  ) {
    return (
      <StyledTableOfContents
        className={className}
        ref={ref}
        label={label}
        sticky={sticky}
        {...rest}
      >
        <TocLabel variant="overline">{label}</TocLabel>
        <TocList>{children}</TocList>
      </StyledTableOfContents>
    )
  },
)

// TableOfContents.displayName = 'eds-toc'

export { TableOfContents }
