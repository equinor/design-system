import { Table } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { ColumnPinningPosition } from '@tanstack/react-table'
import styled from 'styled-components'
import { ResizeInner } from './Resizer'

export const FilterVisibility = styled.div``

export const TableCell = styled(Table.Cell)<{
  $sticky: boolean
  $pinned: ColumnPinningPosition
  $offset: number
  $activeFilter?: boolean
}>`
  font-weight: bold;
  position: ${(p) => (p.$sticky || p.$pinned ? 'sticky' : 'relative')};
  top: 0;
  ${(p) => {
    if (p.$pinned) {
      return `${p.$pinned}: ${p.$offset}px;`
    }
    return ''
  }}
  ${(p) => {
    if (p.$sticky && p.$pinned) return 'z-index: 13'
    if (p.$sticky || p.$pinned) return 'z-index: 12'
  }};
  &:hover ${ResizeInner} {
    background: ${tokens.colors.interactive.primary__hover.rgba};
    opacity: 1;
  }
  ${FilterVisibility} {
    opacity: ${({ $activeFilter }) => ($activeFilter ? 1 : 0)};
  }
  &:hover ${FilterVisibility} {
    opacity: 1;
  }
`
