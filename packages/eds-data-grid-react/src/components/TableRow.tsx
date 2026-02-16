import { Table } from '@equinor/eds-core-react'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTableContext } from '../EdsDataGridContext'
import { EdsDataGridProps } from '../EdsDataGridProps'
import { TableBodyCell } from './TableBodyCell'
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

type Props<T> = {
  row: Row<T>
  onCellClick?: EdsDataGridProps<T>['onCellClick']
  rowVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  virtualItem?: VirtualItem
} & HTMLAttributes<HTMLTableRowElement>

export function TableRow<T>({
  row,
  onCellClick,
  onClick,
  onDoubleClick,
  onContextMenu,
  rowVirtualizer,
  virtualItem,
}: Props<T>) {
  const { rowClass, rowStyle } = useTableContext()
  const isMountedRef = useRef(true)

  // Set mounted flag to false on unmount to prevent measurements during cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Create a stable ref callback that guards against calls during unmount
  const measureRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      // Only measure if we have a node, the component is still mounted, and we have a virtualizer
      if (node && isMountedRef.current && rowVirtualizer) {
        try {
          rowVirtualizer.measureElement(node)
        } catch (error) {
          // Silently catch any errors during measurement to prevent crashes
          // This can happen if the virtualizer is in an inconsistent state during unmount
          const g = globalThis as {
            process?: { env?: { NODE_ENV?: string } }
          }
          if (g.process?.env?.NODE_ENV === 'development') {
            console.warn(
              'Failed to measure element during virtualization:',
              error,
            )
          }
        }
      }
    },
    [rowVirtualizer],
  )

  return (
    <StyledTableRow
      data-index={virtualItem?.index}
      ref={measureRef} //measure dynamic row height safely
      style={{
        ...(rowStyle?.(row) ?? {}),
      }}
      className={`${row.getIsSelected() ? 'selected' : ''} ${rowClass?.(row)}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {row.getVisibleCells().map((cell) => (
        <TableBodyCell
          key={cell.id}
          cell={cell}
          onClick={
            onCellClick ? (event) => onCellClick(cell, event) : undefined
          }
        />
      ))}
    </StyledTableRow>
  )
}

// Neccessary to have this attribute as class to prevent overriding hover color
const StyledTableRow = styled(Table.Row)`
  background-color: inherit;
`
