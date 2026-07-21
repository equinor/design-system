'use client'

import { useId, useState } from 'react'
import type { SemanticColors } from '@/config/semanticColors'

type DataTablePreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to canonical EDS semantic tokens (Figma Color Map):
 *   row hover / pressed → bg-neutral-fill-muted-{default,hover}
 *   selected row        → bg-accent-fill-muted-default + solid-accent left bar
 *   separator           → border-neutral-subtle
 *   name / value        → text-neutral-strong / text-neutral-subtle
 *   status              → text-{success,warning,danger}-subtle
 */
export function DataTablePreview({ colors: c }: DataTablePreviewProps) {
  const uid = useId().replace(/:/g, '')
  const [activeRow, setActiveRow] = useState<number | null>(null)

  const rows = [
    { name: 'Hywind Scotland', status: 'Online', statusColor: c['text-success-subtle'], value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Online', statusColor: c['text-success-subtle'], value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Pending', statusColor: c['text-warning-subtle'], value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Offline', statusColor: c['text-danger-subtle'], value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Online', statusColor: c['text-success-subtle'], value: '124 MW', time: '2 min ago' },
  ]

  return (
    <div
      data-dt={uid}
      style={
        {
          overflow: 'hidden',
          '--_hover': c['bg-neutral-fill-muted-default'],
          '--_pressed': c['bg-neutral-fill-muted-hover'],
          '--_selected': c['bg-accent-fill-muted-default'],
          '--_selected-bar': c['bg-accent-fill-emphasis-default'],
          '--_border': c['border-neutral-subtle'],
        } as React.CSSProperties
      }
    >
      <style>{`
        [data-dt="${uid}"] [data-row] {
          cursor: pointer;
          transition: background-color 100ms;
          box-shadow: inset 3px 0 0 transparent;
        }
        [data-dt="${uid}"] [data-row]:hover {
          background-color: var(--_hover);
        }
        [data-dt="${uid}"] [data-row]:active {
          background-color: var(--_pressed);
        }
        [data-dt="${uid}"] [data-row][data-active] {
          background-color: var(--_selected);
          box-shadow: inset 3px 0 0 var(--_selected-bar);
        }
      `}</style>
      {rows.map((row, i) => (
        <div
          key={i}
          data-row=""
          data-active={activeRow === i ? '' : undefined}
          onClick={() => setActiveRow(activeRow === i ? null : i)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 0',
            borderTop: `0.5px solid ${c['border-neutral-subtle']}`,
          }}
        >
          <div
            style={{
              width: '180px',
              padding: '0 16px',
              fontSize: '14px',
              lineHeight: '20px',
              color: c['text-neutral-strong'],
              flexShrink: 0,
            }}
          >
            {row.name}
          </div>
          <div
            style={{
              padding: '0 16px',
              fontSize: '14px',
              lineHeight: '20px',
              color: row.statusColor,
              flexShrink: 0,
            }}
          >
            {row.status}
          </div>
          <div
            style={{
              padding: '0 16px',
              fontSize: '14px',
              lineHeight: '20px',
              color: c['text-neutral-strong'],
              flexShrink: 0,
            }}
          >
            {row.value}
          </div>
          <div
            style={{
              width: '120px',
              padding: '0 16px',
              fontSize: '12px',
              lineHeight: '16px',
              color: c['text-neutral-subtle'],
              flexShrink: 0,
            }}
          >
            {row.time}
          </div>
        </div>
      ))}
    </div>
  )
}
