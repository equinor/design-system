import type { ReactNode } from 'react'

import './statusChip.css'

export type StatusChipStatus =
  'planned' | 'in-progress' | 'beta' | 'stable' | 'deprecated'

export type StatusChipProps = {
  /** Which maturity the chip represents. Drives the colour. */
  status: StatusChipStatus
  /** Overrides the default label text. */
  children?: ReactNode
}

const LABELS: Record<StatusChipStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In progress',
  beta: 'Beta',
  stable: 'Stable',
  deprecated: 'Deprecated',
}

export function StatusChip({ status, children }: StatusChipProps) {
  return (
    <span className="docs-status-chip" data-status={status}>
      {children ?? LABELS[status]}
    </span>
  )
}
