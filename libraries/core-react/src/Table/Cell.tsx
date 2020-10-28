import React, { HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'
import type { Border } from '@equinor/eds-tokens'
import { getTokens, TableCell } from './Table.tokens'
import { typographyTemplate } from '../_common/templates'

const borderTemplate = (borders: { bottom: Border }) =>
  Object.keys(borders).reduce((acc, val) => {
    const { color, width }: Border = borders[val] as Border
    return `${acc} border-${val}: ${width} solid ${color}; \n`
  }, '')

type BaseProps = {
  tokens: TableCell
  as: string
}
const Base = ({ tokens, as }: BaseProps) => {
  const { background, height, text, spacings, borders } = tokens
  const { typography } = text
  const bordersAndBackground =
    as !== 'th'
      ? css`
          ${borderTemplate(borders)}
          background: ${background};
        `
      : ''

  const base = css`
    min-height: ${height};
    height: ${height};

    padding-left: ${spacings.left};
    padding-right: ${spacings.right};

    ${bordersAndBackground}
    ${typographyTemplate(typography)}
  `
  return base
}

const TableBase = styled.td`
  ${Base}
`

type CellProps = {
  /** Specifies which td or th to use */
  as?: 'td' | 'th'
  /** Specifies which variant to use */
  variant?: 'text' | 'icon' | 'numeric' | 'input'
  /** Is the header cell scoped to column or row? */
  scope?: 'row' | 'col'
  /** @ignore */
  children: ReactNode
}

export const Cell = ({
  children,
  as = 'td',
  variant = 'text',
  ...props
}: CellProps): JSX.Element => {
  const tokens = getTokens(as, variant)
  return (
    <TableBase as={as} tokens={tokens} {...props}>
      {children}
    </TableBase>
  )
}

// Cell.displayName = 'eds-table-cell'
