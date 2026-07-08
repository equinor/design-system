'use client'

import { useId, useState } from 'react'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type DataTablePreviewProps = {
  neutral: string[]
  accent: string[]
  dataColors: GeneratedPalette[]
}

/**
 * Figma semantic → primitive mapping:
 *
 *   background/surface/default/default    = Gray/1  → neutral[0]  (default row)
 *   background/surface/default/hover      = Gray/2  → neutral[1]  (hover row)
 *   background/surface/default/pressed    = Gray/3  → neutral[2]  (pressed row)
 *   background/surface/default/selected   = Accent/2 → accent[1]  (selected row)
 *   border/default                        = Gray/4  → neutral[3]  (row separator)
 *
 *   text/primary                                    → neutral[11] (primary text, Gray/12)
 *   text/subtle                                     → neutral[8]  (timestamps, Gray/9)
 *   text/link                                       → accent[12]  (name link)
 *
 *   dataColor text/strong                           → dataColor[12] (status text)
 */
export function DataTablePreview({
  neutral,
  accent,
  dataColors,
}: DataTablePreviewProps) {
  const uid = useId().replace(/:/g, '')
  const [activeRow, setActiveRow] = useState<number | null>(null)

  const greenPal = dataColors.find((p) =>
    p.name.toLowerCase().includes('green'),
  )
  const orangePal = dataColors.find((p) =>
    p.name.toLowerCase().includes('orange'),
  )
  const redPal = dataColors.find((p) => p.name.toLowerCase().includes('red'))

  const rows = [
    { name: 'Hywind Scotland', status: 'Online', statusColor: greenPal, value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Online', statusColor: greenPal, value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Pending', statusColor: orangePal, value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Offline', statusColor: redPal, value: '124 MW', time: '2 min ago' },
    { name: 'Hywind Scotland', status: 'Online', statusColor: greenPal, value: '124 MW', time: '2 min ago' },
  ]

  return (
    <div
      data-dt={uid}
      style={
        {
          overflow: 'hidden',
          '--_hover': neutral[1],
          '--_pressed': neutral[2],
          '--_selected': accent[1],
          '--_border': neutral[3],
        } as React.CSSProperties
      }
    >
      <style>{`
        [data-dt="${uid}"] [data-row] {
          cursor: pointer;
          transition: background-color 100ms;
        }
        [data-dt="${uid}"] [data-row]:hover {
          background-color: var(--_hover);
        }
        [data-dt="${uid}"] [data-row]:active {
          background-color: var(--_pressed);
        }
        [data-dt="${uid}"] [data-row][data-active] {
          background-color: var(--_selected);
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
            borderTop: `0.5px solid ${neutral[3]}`,
          }}
        >
          <div
            style={{
              width: '180px',
              padding: '0 16px',
              fontSize: '14px',
              lineHeight: '20px',
              color: accent[12],
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
              color: row.statusColor?.steps[11] ?? neutral[11],
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
              color: neutral[11],
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
              color: neutral[8],
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
