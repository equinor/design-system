import * as React from 'react'
import { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { token } from './Cell/DataCell.tokens'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  background: ${token.background};
`

export type TableProps = HTMLAttributes<HTMLTableElement>

export const Table: FunctionComponent<TableProps> = ({
  children,
  ...props
}) => {
  return <TableBase {...props}>{children}</TableBase>
}

// Table.displayName = 'EdsTable'
