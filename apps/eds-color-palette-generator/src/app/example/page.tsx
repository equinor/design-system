'use client'

import { useMemo, useState } from 'react'
import { refresh } from '@equinor/eds-icons'
import { useColorScheme } from '@/context/ColorSchemeContext'
import {
  examplePalettes,
  pickAt,
  pickIndex,
  type PalettePick,
} from '@/utils/palette'
import {
  refreshCustomPalettes,
  useCustomPalettes,
} from '@/utils/customPalettesStore'
import {
  InteractivePicker,
  PredefinedGroups,
  SurfacePreviewSection,
} from '@/components/example'
import { AppHeader } from '@/components/shared/AppHeader'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { Main } from '@/components/shared/Main'

export default function ExamplePage() {
  const { colorScheme } = useColorScheme()
  // null until a palette is picked, which shows the first one
  const [pick, setPick] = useState<PalettePick | null>(null)
  const customPalettes = useCustomPalettes()

  // The seven Tokens Studio hues for the current scheme with the palettes
  // saved in the Palette editor, which are light ramps
  const allPalettes = useMemo(
    () => examplePalettes(colorScheme, customPalettes),
    [colorScheme, customPalettes],
  )

  // The pick is found by name, so it follows a scheme switch; a saved
  // palette that disappeared on refresh falls back to the first one
  const selected = pick ? pickIndex(allPalettes, pick) : 0
  const palette = allPalettes[selected]

  // Custom palettes may repeat a name, so the index is the value
  const paletteOptions: SegmentedOption<string>[] = allPalettes.map((p, i) => ({
    value: String(i),
    label: p.name,
  }))

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <AppHeader />

      <Main className="max-w-6xl mx-auto py-8">
        <h1 className="m-0 text-header-2xl font-medium">Examples</h1>

        {/* Palette picker */}
        <div className="mt-4 mb-6 flex flex-wrap items-center gap-3">
          <SegmentedControl
            mode="radio"
            aria-label="Palette"
            layout="wrap"
            options={paletteOptions}
            value={String(selected)}
            onChange={(v) => setPick(pickAt(allPalettes, Number(v)))}
          />
          <Button
            variant="ghost"
            onClick={refreshCustomPalettes}
            title="Refresh custom palettes from the Palette editor"
          >
            <Icon data={refresh} size={18} />
            Refresh
          </Button>
        </div>

        <PredefinedGroups palette={palette} />
        <SurfacePreviewSection allPalettes={allPalettes} />
        <InteractivePicker allPalettes={allPalettes} />
      </Main>
    </div>
  )
}
