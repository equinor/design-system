import * as React from 'react'
import { FunctionComponent, HTMLAttributes, useEffect } from 'react'
import styled from 'styled-components'
import { token } from './Cell/DataCell.tokens'
import { useTable } from './Table.context'
import { Density } from './Table.types'

const TableBase = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  background: ${token.background};
`

export type TableProps = {
  density?: Density
} & HTMLAttributes<HTMLTableElement>

export const Table: FunctionComponent<TableProps> = ({
  children,
  density = 'comfortable',
  ...props
}) => {
  const { setDensity } = useTable()

  useEffect(() => {
    setDensity(density)
  }, [density])

  return <TableBase {...props}>{children}</TableBase>
}

// Table.displayName = 'EdsTable'
