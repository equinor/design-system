import React, { forwardRef, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { List } from '../List'
import { Typography } from '../Typography'

import { tableOfContents as tokens } from './TableOfContents.tokens'

const { labelText } = tokens

type Props = {
  /** Sticky functionality */
  sticky?: boolean
  /** Label or title for the ToC */
  label?: string
} & HTMLAttributes<HTMLElement>

const StyledTableOfContents = styled.nav<Props>`
  margin: 48px 0 32px 0;

  ${({ sticky }) =>
    sticky &&
    css`
      position: fixed;
      top: 32px;
      right: 32px;
    `}
`

const TocList = styled(List)`
  margin: 0;
  padding: 0;
`

const TocLabel = styled(Typography)`
  color: ${labelText.color};
`

const TableOfContents = forwardRef<HTMLElement, Props>(function TableOfContents(
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
})

TableOfContents.displayName = 'eds-toc'

export { TableOfContents }
