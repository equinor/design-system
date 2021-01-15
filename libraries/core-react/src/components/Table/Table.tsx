import * as React from 'react'
import { forwardRef, HTMLAttributes, useEffect } from 'react'
import styled from 'styled-components'
import { token } from './Cell/DataCell.tokens'
import { useTable } from './Table.context'
import { useEds } from './../../contexts/eds.context'
import { Density } from './Table.types'

const TableBase = styled.table`
  border-spacing: 0;
  background: ${token.background};
`

export type TableProps = {
  density?: Density
} & HTMLAttributes<HTMLTableElement>

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { children, density = 'comfortable', ...props },
  ref,
) {
  const { setDensity } = useEds()

  useEffect(() => {
    setDensity(density)
  }, [density])

  return (
    <TableBase {...props} ref={ref}>
      {children}
    </TableBase>
  )
})

// Table.displayName = 'EdsTable'
