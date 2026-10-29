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

/**
 * A palette in the editor with an id for its React key, so a card keeps its
 * DOM and focus when a palette before it is removed. The id is not saved.
 */
type EditorPalette = { id: number; palette: TokenPalette }

let nextPaletteId = 0

function withIds(palettes: TokenPalette[]): EditorPalette[] {
  return palettes.map((palette) => ({ id: nextPaletteId++, palette }))
}

/** The list with the palette at `index` changed and the others kept. */
function changeAt(
  entries: EditorPalette[],
  index: number,
  change: (palette: TokenPalette) => TokenPalette,
): EditorPalette[] {
  return entries.map((entry, i) =>
    i === index ? { ...entry, palette: change(entry.palette) } : entry,
  )
}

export default function PalettePage() {
  const [entries, setEntries] = useState<EditorPalette[]>([])
  const [viewMode, setViewMode] = useState<PaletteViewMode>('curve')
  const [hasAutoImported, setHasAutoImported] = useState(false)

  /* ---- Start from the saved palettes, or the Tokens Studio hues ---- */
  useEffect(() => {
    if (hasAutoImported) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot client-only start; localStorage is not there during SSR, and saving below must not run before this
    setHasAutoImported(true)
    // An empty saved list stays empty; "Reset to Tokens Studio" brings the
    // hues back
    setEntries(
      withIds(getSimulationPalettes() ?? editablePalettesFromTokensStudio()),
    )
  }, [hasAutoImported])

  /* ---- Auto-save to localStorage ---- */
  useEffect(() => {
    if (!hasAutoImported) return
    setSimulationPalettes(entries.map((entry) => entry.palette))
  }, [entries, hasAutoImported])

  /* ---- Palette CRUD ---- */
  const addPalette = useCallback((p: TokenPalette) => {
    const added = withIds([p])
    setEntries((prev) => [...prev, ...added])
  }, [])

  const removePalette = useCallback(
    (index: number) => setEntries((prev) => prev.filter((_, i) => i !== index)),
    [],
  )

  const updatePaletteName = useCallback(
    (index: number, name: string) =>
      setEntries((prev) => changeAt(prev, index, (p) => ({ ...p, name }))),
    [],
  )

  const updateStep = useCallback(
    (paletteIndex: number, stepIndex: number, hex: string) =>
      setEntries((prev) =>
        changeAt(prev, paletteIndex, (p) => ({
          ...p,
          steps: p.steps.map((s, j) => (j === stepIndex ? hex : s)),
        })),
      ),
    [],
  )

  /* ---- Back to the Tokens Studio hues (replaces all) ---- */
  const resetToTokensStudio = useCallback(() => {
    setEntries(withIds(editablePalettesFromTokensStudio()))
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
          {entries.map(({ id, palette }, index) => (
            <PaletteCard
              key={id}
              palette={palette}
              index={index}
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
