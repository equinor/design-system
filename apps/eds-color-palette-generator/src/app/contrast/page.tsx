'use client'

import { useState, useMemo } from 'react'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { tokensStudioPalettes } from '@/utils/semanticTokens'
import {
  buildPatternGroups,
  buildStepData,
  getLightness,
  type ViewMode,
} from '@/utils/contrastPageData'
import { CombinedPatternView, SinglePaletteView } from '@/components/contrast'
import { AppHeader } from '@/components/shared/AppHeader'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { Main } from '@/components/shared/Main'

const VIEW_MODES: SegmentedOption<ViewMode>[] = [
  { value: 'semantic', label: 'Curve' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'combined', label: 'Combined' },
]

export default function ContrastPage() {
  const { colorScheme } = useColorScheme()
  const [activePalette, setActivePalette] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('semantic')

  // The seven Tokens Studio hues, generated for the current scheme
  const palettes = useMemo(
    () => tokensStudioPalettes(colorScheme),
    [colorScheme],
  )
  const palette = palettes[activePalette] ?? palettes[0]

  const displayData = useMemo(() => {
    if (viewMode === 'combined') return []
    if (viewMode === 'semantic') {
      return buildStepData(palette.steps, 'semantic')
    }
    const sorted = palette.steps
      .map((hex, i) => ({ hex, i }))
      .sort((a, b) => getLightness(b.hex) - getLightness(a.hex))
    return buildStepData(
      sorted.map((s) => s.hex),
      'gradient',
      sorted.map((s) => s.i + 1),
    )
  }, [palette, viewMode])

  const patternGroups = useMemo(() => {
    if (viewMode !== 'combined') return []
    return buildPatternGroups(colorScheme)
  }, [viewMode, colorScheme])

  const paletteOptions: SegmentedOption<string>[] = palettes.map((p, i) => ({
    value: String(i),
    label: p.name,
  }))

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <AppHeader />

      <Main className="max-w-6xl mx-auto py-8">
        <h1 className="m-0 text-header-2xl font-medium">Contrast</h1>

        <div className="mt-4 mb-6 flex flex-wrap items-center gap-3">
          {/* Palette picker, hidden in the combined view */}
          {viewMode !== 'combined' && (
            <SegmentedControl
              mode="radio"
              aria-label="Palette"
              options={paletteOptions}
              value={String(activePalette)}
              onChange={(v) => setActivePalette(Number(v))}
            />
          )}

          <SegmentedControl
            mode="radio"
            aria-label="View"
            className="ml-auto"
            options={VIEW_MODES}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>

        {viewMode === 'combined' && (
          <CombinedPatternView patternGroups={patternGroups} />
        )}

        {viewMode !== 'combined' && (
          <SinglePaletteView displayData={displayData} mode={viewMode} />
        )}
      </Main>
    </div>
  )
}
