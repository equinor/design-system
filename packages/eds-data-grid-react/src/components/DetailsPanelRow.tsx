import { Table as EdsTable } from '@equinor/eds-core-react'
import { tokens } from '@equinor/eds-tokens'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { Row } from '../types'

interface DetailsPanelRowProps<T> {
  row: Row<T>
  getColSpan: () => number
  renderDetailPanel?: (row: Row<T>) => ReactNode
}

export function DetailsPanelRow<T>({
  row,
  getColSpan,
  renderDetailPanel,
}: DetailsPanelRowProps<T>) {
  if (!renderDetailPanel || !row.getIsExpanded()) {
    return null
  }

  return (
    <EdsTable.Row>
      <StyledCell colSpan={getColSpan()}>{renderDetailPanel(row)}</StyledCell>
    </EdsTable.Row>
  )
}

const StyledCell = styled(EdsTable.Cell)`
  padding-top: ${tokens.spacings.comfortable.small};
  padding-bottom: ${tokens.spacings.comfortable.small};
`
