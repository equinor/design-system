'use client'

import { useState, useEffect, useCallback } from 'react'
import { add } from '@equinor/eds-icons'
import {
  editablePalettesFromTokensStudio,
  getSimulationPalettes,
  setSimulationPalettes,
  type TokenPalette,
} from '@/utils/palette'
import { PaletteCard, type PaletteViewMode } from '@/components/palette'
import { AppHeader } from '@/components/shared/AppHeader'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { Main } from '@/components/shared/Main'

const VIEW_MODES: SegmentedOption<PaletteViewMode>[] = [
  { value: 'curve', label: 'Curve' },
  { value: 'gradient', label: 'Gradient' },
]

export default function PalettePage() {
  const [palettes, setPalettes] = useState<TokenPalette[]>([])
  const [viewMode, setViewMode] = useState<PaletteViewMode>('curve')
  const [hasAutoImported, setHasAutoImported] = useState(false)

  /* ---- Start from the saved palettes, or the Tokens Studio hues ---- */
  useEffect(() => {
    if (hasAutoImported) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only start; localStorage is not there during SSR, and saving below must not run before this
    setHasAutoImported(true)
    const saved = getSimulationPalettes()
    setPalettes(saved.length > 0 ? saved : editablePalettesFromTokensStudio())
  }, [hasAutoImported])

  /* ---- Auto-save to localStorage ---- */
  useEffect(() => {
    if (!hasAutoImported) return
    setSimulationPalettes(palettes)
  }, [palettes, hasAutoImported])

  /* ---- Palette CRUD ---- */
  const addPalette = useCallback(
    (p: TokenPalette) => setPalettes((prev) => [...prev, p]),
    [],
  )

  const removePalette = useCallback(
    (index: number) =>
      setPalettes((prev) => prev.filter((_, i) => i !== index)),
    [],
  )

  const updatePaletteName = useCallback(
    (index: number, name: string) =>
      setPalettes((prev) =>
        prev.map((p, i) => (i === index ? { ...p, name } : p)),
      ),
    [],
  )

  const updateStep = useCallback(
    (paletteIndex: number, stepIndex: number, hex: string) =>
      setPalettes((prev) =>
        prev.map((p, i) =>
          i === paletteIndex
            ? {
                ...p,
                steps: p.steps.map((s, j) => (j === stepIndex ? hex : s)),
              }
            : p,
        ),
      ),
    [],
  )

  /* ---- Back to the Tokens Studio hues (replaces all) ---- */
  const resetToTokensStudio = useCallback(() => {
    setPalettes(editablePalettesFromTokensStudio())
  }, [])

  return (
    <div className="min-h-screen bg-canvas text-primary">
      <AppHeader />

      <Main className="max-w-6xl mx-auto py-8">
        <h1 className="m-0 text-header-2xl font-medium">Palette editor</h1>
        <p className="m-0 mt-2 max-w-3xl text-sm text-secondary">
          The palettes are light-mode ramps, saved in this browser. On the
          Examples page, a palette named after a Tokens Studio hue replaces that
          hue in light mode. In dark mode, edited and new palettes follow the
          dark hues, marked &ldquo;(light)&rdquo;.
        </p>

        {/* ---- Actions ---- */}
        <div className="mt-4 mb-6 flex flex-wrap items-center gap-3">
          <Button
            onClick={() =>
              addPalette({
                name: 'Custom',
                steps: Array(15).fill('#888888'),
              })
            }
          >
            <Icon data={add} size={18} />
            Custom HEX
          </Button>
          <Button variant="ghost" onClick={resetToTokensStudio}>
            Reset to Tokens Studio
          </Button>

          <SegmentedControl
            mode="radio"
            aria-label="View"
            className="ml-auto"
            options={VIEW_MODES}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>

        {/* ---- Palette list ---- */}
        <div className="flex flex-col gap-8">
          {palettes.map((pal, palIdx) => (
            <PaletteCard
              key={palIdx}
              palette={pal}
              index={palIdx}
              viewMode={viewMode}
              onNameChange={updatePaletteName}
              onRemove={removePalette}
              onStepChange={updateStep}
            />
          ))}
        </div>
      </Main>
    </div>
  )
}
