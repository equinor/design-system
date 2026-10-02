'use client'

import { useState, useMemo } from 'react'
import { calcContrast } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import { Card } from '@/components/shared/Card'
import { StepSelect } from './StepSelect'

type Palette = { name: string; steps: string[] }

function ContrastPair({
  label,
  fgHex,
  bgHex,
}: {
  label: string
  fgHex: string
  bgHex: string
}) {
  const result = useMemo(() => calcContrast(fgHex, bgHex), [fgHex, bgHex])
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-secondary">{label}</span>
      <span className="font-mono font-medium text-primary">{result.wcag}</span>
      <Badge pass={result.aa} label="AA" />
      <Badge pass={result.aaa} label="AAA" />
    </div>
  )
}

export function SurfacePreview({ palettes }: { palettes: Palette[] }) {
  // 0-based step indices. Defaults follow the Tokens Studio roles:
  // background.canvas (1) → background.surface (15)
  // → background.non-interactive.<tone>.default (3) → background.surface (15),
  // border.non-interactive.<tone>.muted (4) and text.primary (13).
  const [page, setPage] = useState(0)
  const [panel, setPanel] = useState(14)
  const [cardRow, setCardRow] = useState(2)
  const [card, setCard] = useState(14)
  const [border, setBorder] = useState(3)
  const [text, setText] = useState(12)

  return (
    <Card
      title="Surface preview"
      description="Visualise nested surface layers per palette — adjust roles to test combinations"
    >
      {/* Dropdowns */}
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
        <StepSelect
          label="Page"
          value={page}
          onChange={setPage}
          only="background"
        />
        <StepSelect
          label="Panel"
          value={panel}
          onChange={setPanel}
          only="background"
        />
        <StepSelect
          label="Card row"
          value={cardRow}
          onChange={setCardRow}
          only="background"
        />
        <StepSelect
          label="Card"
          value={card}
          onChange={setCard}
          only="background"
        />
        <StepSelect
          label="Border"
          value={border}
          onChange={setBorder}
          only="border"
        />
        <StepSelect label="Text" value={text} onChange={setText} only="text" />
      </div>

      {/* Per-palette preview */}
      <div className="flex flex-col gap-6">
        {palettes.map((p) => (
          <div key={p.name} className="flex flex-col gap-2">
            <h3 className="m-0 text-base font-medium text-primary">{p.name}</h3>

            {/* Nested box layout */}
            <div
              className="rounded p-4"
              style={{ backgroundColor: p.steps[page] }}
            >
              <div
                className="rounded p-3"
                style={{ backgroundColor: p.steps[panel] }}
              >
                <div
                  className="flex gap-3 rounded p-3"
                  style={{ backgroundColor: p.steps[cardRow] }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex min-h-12 flex-1 items-center justify-center rounded border-[1.5px] p-3 text-base font-medium"
                      style={{
                        backgroundColor: p.steps[card],
                        borderColor: p.steps[border],
                        color: p.steps[text],
                      }}
                    >
                      Card {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contrast ratios between adjacent layers */}
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <ContrastPair
                label="Page / Panel"
                fgHex={p.steps[panel]}
                bgHex={p.steps[page]}
              />
              <ContrastPair
                label="Panel / Card row"
                fgHex={p.steps[cardRow]}
                bgHex={p.steps[panel]}
              />
              <ContrastPair
                label="Card row / Card"
                fgHex={p.steps[card]}
                bgHex={p.steps[cardRow]}
              />
              <ContrastPair
                label="Border / Card"
                fgHex={p.steps[border]}
                bgHex={p.steps[card]}
              />
              <ContrastPair
                label="Text / Card"
                fgHex={p.steps[text]}
                bgHex={p.steps[card]}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
