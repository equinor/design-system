import { forwardRef, HTMLAttributes } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { List } from '../List'
import { Typography } from '../Typography'
import { typographyTemplate, useToken } from '@equinor/eds-utils'
import { tableOfContents as tableOfContentToken } from './TableOfContents.tokens'
import { useEds } from '../EdsProvider'

export type TableOfContentsProps = {
  /** Sticky functionality */
  sticky?: boolean
  /** Label or title for the ToC */
  label?: string
} & HTMLAttributes<HTMLElement>

const StyledTableOfContents = styled.nav<TableOfContentsProps>(
  ({ theme, sticky }) => {
    return css`
      margin-top: ${theme.spacings.top};
      margin-bottom: ${theme.spacings.bottom};
      ${sticky &&
      css`
        position: fixed;
        top: ${theme.entities.sticky.spacings.top};
        right: ${theme.entities.sticky.spacings.right};
      `}
    `
  },
)

const TocList = styled(List)`
  margin: 0;
  padding: 0;
`

const TocLabel = styled(Typography)(({ theme }) => {
  return css`
    ${typographyTemplate(theme.typography)}
  `
})

const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  function TableOfContents(
    { children, sticky = false, label = '', ...rest },
    ref,
  ) {
    const { density } = useEds()
    const token = useToken({ density }, tableOfContentToken)

    return (
      <ThemeProvider theme={token}>
        <StyledTableOfContents
          ref={ref}
          label={label}
          sticky={sticky}
          {...rest}
        >
          <TocLabel variant="overline">{label}</TocLabel>
          <TocList>{children}</TocList>
        </StyledTableOfContents>
      </ThemeProvider>
    )
  },
)

export { TableOfContents }
