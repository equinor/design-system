import * as React from 'react'
import { forwardRef, HTMLAttributes } from 'react'
import styled from 'styled-components'
import { token } from './Cell/DataCell.tokens'
import { EdsProvider } from '../EdsProvider'
// import { Density } from './Table.types'

const TableBase = styled.table`
  border-spacing: 0;
  background: ${token.background};
`

export type TableProps = {
  // density?: Density
} & HTMLAttributes<HTMLTableElement>

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    children,
    // density = 'comfortable',
    ...props
  },
  ref,
) {
  return (
    <EdsProvider
    // density={density}
    >
      <TableBase {...props} ref={ref}>
        {children}
      </TableBase>
    </EdsProvider>
  )
})

// Table.displayName = 'EdsTable'
