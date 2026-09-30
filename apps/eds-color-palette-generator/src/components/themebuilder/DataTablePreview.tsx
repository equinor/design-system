'use client'

import { useId, useState } from 'react'
import type { SemanticColors } from '@/utils/semanticTokens'

type DataTablePreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to Tokens Studio semantic tokens:
 *   row hover / pressed → background.interactive.neutral.muted.{default,hover}
 *   selected row        → background.interactive.accent.muted.default
 *                         + a background.interactive.accent.emphasis.default bar
 *   separator           → border.non-interactive.neutral.muted
 *   name, value / time  → text.primary / text.secondary
 *   status              → text.on-default.{success,warning,danger}
 */
export function DataTablePreview({ colors: c }: DataTablePreviewProps) {
  const uid = useId().replace(/:/g, '')
  const [activeRow, setActiveRow] = useState<number | null>(null)

  const rows = [
    {
      name: 'Hywind Scotland',
      status: 'Online',
      statusColor: c['text.on-default.success'],
      value: '124 MW',
      time: '2 min ago',
    },
    {
      name: 'Hywind Scotland',
      status: 'Online',
      statusColor: c['text.on-default.success'],
      value: '124 MW',
      time: '2 min ago',
    },
    {
      name: 'Hywind Scotland',
      status: 'Pending',
      statusColor: c['text.on-default.warning'],
      value: '124 MW',
      time: '2 min ago',
    },
    {
      name: 'Hywind Scotland',
      status: 'Offline',
      statusColor: c['text.on-default.danger'],
      value: '124 MW',
      time: '2 min ago',
    },
    {
      name: 'Hywind Scotland',
      status: 'Online',
      statusColor: c['text.on-default.success'],
      value: '124 MW',
      time: '2 min ago',
    },
  ]

  return (
    <div
      data-dt={uid}
      style={
        {
          overflow: 'hidden',
          '--_hover': c['background.interactive.neutral.muted.default'],
          '--_pressed': c['background.interactive.neutral.muted.hover'],
          '--_selected': c['background.interactive.accent.muted.default'],
          '--_selected-bar':
            c['background.interactive.accent.emphasis.default'],
          '--_border': c['border.non-interactive.neutral.muted'],
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
            borderTop: `0.5px solid ${c['border.non-interactive.neutral.muted']}`,
          }}
        >
          <div
            style={{
              width: '180px',
              padding: '0 16px',
              fontSize: '14px',
              lineHeight: '20px',
              color: c['text.primary'],
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
              color: c['text.primary'],
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
              color: c['text.secondary'],
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
