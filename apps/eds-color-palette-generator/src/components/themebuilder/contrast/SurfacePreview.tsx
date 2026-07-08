'use client'

import { useState, useMemo } from 'react'
import { calcContrast } from '@/utils/palette'
import { Badge } from '@/components/Badge'
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
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-subtle">{label}</span>
      <span className="font-mono font-semibold text-strong">
        {result.wcag}
      </span>
      <Badge pass={result.aa} label="AA" />
      <Badge pass={result.aaa} label="AAA" />
    </div>
  )
}

export function SurfacePreview({ palettes }: { palettes: Palette[] }) {
  const [page, setPage] = useState(0)
  const [panel, setPanel] = useState(1)
  const [cardRow, setCardRow] = useState(2)
  const [card, setCard] = useState(0)
  const [border, setBorder] = useState(6)
  const [text, setText] = useState(11)

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-strong m-0">
          Surface preview
        </h2>
        <p className="text-sm text-subtle m-0 mt-1">
          Visualize nested surface layers per palette — adjust roles to test
          combinations
        </p>
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <StepSelect label="Page" value={page} onChange={setPage} only={['bg/']} />
        <StepSelect label="Panel" value={panel} onChange={setPanel} only={['bg/']} />
        <StepSelect label="Card row" value={cardRow} onChange={setCardRow} only={['bg/']} />
        <StepSelect label="Card" value={card} onChange={setCard} only={['bg/']} />
        <StepSelect label="Border" value={border} onChange={setBorder} only={['border/']} />
        <StepSelect label="Text" value={text} onChange={setText} only={['fg/']} />
      </div>

      {/* Per-palette preview */}
      <div className="flex flex-col gap-6">
        {palettes.map((p) => (
          <div key={p.name} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-strong m-0">
              {p.name}
            </h3>

            {/* Nested box layout */}
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: p.steps[page] }}
            >
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: p.steps[panel] }}
              >
                <div
                  className="rounded-lg p-3 flex gap-3"
                  style={{ backgroundColor: p.steps[cardRow] }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-md p-3 flex items-center justify-center"
                      style={{
                        backgroundColor: p.steps[card],
                        border: `1.5px solid ${p.steps[border]}`,
                        color: p.steps[text],
                        fontSize: 13,
                        fontWeight: 600,
                        minHeight: 48,
                      }}
                    >
                      Card {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contrast ratios between adjacent layers */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
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
    </section>
  )
}
