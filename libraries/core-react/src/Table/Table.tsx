import React, { FunctionComponent, HTMLAttributes } from 'react'
import styled from 'styled-components'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
`

type Props = HTMLAttributes<HTMLTableElement>

export const Table: FunctionComponent<Props> = ({ children, ...props }) => {
  return <TableBase {...props}>{children}</TableBase>
}

// Table.displayName = 'EdsTable'
