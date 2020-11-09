import { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
`

export type TableProps = HTMLAttributes<HTMLTableElement>

export const Table: FunctionComponent<TableProps> = ({
  children,
  ...props
}) => {
  return <TableBase {...props}>{children}</TableBase>
}

// Table.displayName = 'EdsTable'
