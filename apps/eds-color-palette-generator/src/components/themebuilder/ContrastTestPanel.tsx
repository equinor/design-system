'use client'

import { useState } from 'react'
import {
  SegmentedControl,
  TabPanel,
} from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
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

const SUB_TABS: SegmentedOption<SubTab>[] = [
  { value: 'eds', label: 'EDS' },
  { value: 'custom', label: 'Custom' },
]

const ID_PREFIX = 'contrast-sub'

export function ContrastTestPanel({ palettes }: ContrastTestPanelProps) {
  const [subTab, setSubTab] = useState<SubTab>('eds')

  if (palettes.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        mode="tabs"
        idPrefix={ID_PREFIX}
        aria-label="Contrast checks"
        options={SUB_TABS}
        value={subTab}
        onChange={setSubTab}
        className="self-start"
      />

      <TabPanel
        idPrefix={ID_PREFIX}
        value={subTab}
        className="flex flex-col gap-6"
      >
        {subTab === 'eds' ? (
          <>
            <SemanticPairings palettes={palettes} />
            <SurfacePreview palettes={palettes} />
          </>
        ) : (
          <>
            <DataColorChart palettes={palettes} />
            <SamePalettePairings palettes={palettes} />
            <InteractivePicker palettes={palettes} />
          </>
        )}
      </TabPanel>
    </div>
  )
}
