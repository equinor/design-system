'use client'

import { useState, useMemo } from 'react'
import { SemanticPairings } from './contrast/SemanticPairings'
import { SurfacePreview } from './contrast/SurfacePreview'
import { InteractivePicker } from './contrast/InteractivePicker'
import { DataColorChart } from './contrast/DataColorChart'
import { SamePalettePairings } from './contrast/SamePalettePairings'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type ContrastTestPanelProps = {
  palettes: GeneratedPalette[]
}

type SubTab = 'eds' | 'custom'

export function ContrastTestPanel({ palettes }: ContrastTestPanelProps) {
  const stablePalettes = useMemo(() => palettes, [palettes])
  const [subTab, setSubTab] = useState<SubTab>('eds')

  if (stablePalettes.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab toggle */}
      <div className="flex rounded-lg overflow-hidden border border-neutral-subtle self-start">
        <button
          type="button"
          onClick={() => setSubTab('eds')}
          className={[
            'cursor-pointer px-4 py-1.5 text-sm border-none',
            subTab === 'eds'
              ? 'bg-neutral-fill-emphasis-default text-strong-on-emphasis font-semibold'
              : 'bg-default text-subtle font-normal',
          ].join(' ')}
        >
          EDS
        </button>
        <button
          type="button"
          onClick={() => setSubTab('custom')}
          className={[
            'cursor-pointer px-4 py-1.5 text-sm border-none border-l border-neutral-subtle',
            subTab === 'custom'
              ? 'bg-neutral-fill-emphasis-default text-strong-on-emphasis font-semibold'
              : 'bg-default text-subtle font-normal',
          ].join(' ')}
        >
          Custom
        </button>
      </div>

      {subTab === 'eds' ? (
        <div className="flex flex-col gap-6">
          <SemanticPairings palettes={stablePalettes} />
          <SurfacePreview palettes={stablePalettes} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <DataColorChart palettes={stablePalettes} />
          <SamePalettePairings palettes={stablePalettes} />
          <InteractivePicker palettes={stablePalettes} />
        </div>
      )}
    </div>
  )
}
