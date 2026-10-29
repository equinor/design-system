'use client'

import { useId } from 'react'
import { add, close } from '@equinor/eds-icons'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Icon } from '@/components/shared/Icon'
import { SimpleColorPicker } from './SimpleColorPicker'
import type { ColorFormat } from '@/types'
import { newPaletteId, paletteKey, type PaletteInput } from '@/utils/urlState'
import { hueKey } from '@/config/tokensStudio'
import { nameProblems, type NameProblem } from '@/utils/paletteConfigFile'
import { useColorFormat } from '@/context/ColorFormatContext'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'

/** A mid grey, for new palettes */
const DEFAULT_COLOUR = 'oklch(0.6 0 0)'

/**
 * "Colour N" for a new palette, with N past any name already taken. Several
 * views and the Tokens Studio download tell palettes apart by hue key, so
 * `colour 3` takes `Colour 3`.
 */
function newPaletteName(palettes: PaletteInput[]): string {
  const taken = new Set(palettes.map((p) => hueKey(p.name)))
  let n = palettes.length + 1
  while (taken.has(hueKey(`Colour ${n}`))) n++
  return `Colour ${n}`
}

function nameProblemText(problem: NameProblem): string {
  switch (problem.kind) {
    case 'empty':
      return 'Enter a name for the palette.'
    case 'syntax':
      return `Remove "${problem.char}" from the name. Tokens Studio reads ".", "{" and "}" in a name, and "$" at its start, as token syntax.`
    case 'duplicate':
      return `Palette ${problem.otherIndex + 1} has the same name. Names that differ only in case or spacing count as the same.`
  }
}

// How colour values are shown on the whole Theme Builder page. OKLCH is the
// canonical form (ADR 0016 D9); palettes are stored in OKLCH either way.
const FORMAT_OPTIONS: SegmentedOption<ColorFormat>[] = [
  { value: 'OKLCH', label: 'OKLCH' },
  { value: 'HEX', label: 'HEX' },
]

const FIELD = 'rounded border bg-input px-2 py-1 text-sm text-primary'

type PaletteInputPanelProps = {
  palettes: PaletteInput[]
  onChange: (palettes: PaletteInput[]) => void
}

/**
 * The palettes, one colour each. As in Tokens Studio, a palette's colour is
 * its anchor: it gives the hue and chroma, and the scale gives every step's
 * lightness (ADR 0016 D2).
 */
export function PaletteInputPanel({
  palettes,
  onChange,
}: PaletteInputPanelProps) {
  const { format, setFormat } = useColorFormat()
  const idPrefix = useId()
  const problems = nameProblems(palettes)

  const updateName = (index: number, name: string) => {
    const next = [...palettes]
    next[index] = { ...next[index], name }
    onChange(next)
  }

  const updateBaseColor = (index: number, baseColor: string) => {
    const next = [...palettes]
    next[index] = { ...next[index], baseColor }
    onChange(next)
  }

  const removePalette = (index: number) => {
    if (palettes.length <= 1) return
    onChange(palettes.filter((_, i) => i !== index))
  }

  const addPalette = () => {
    onChange([
      ...palettes,
      {
        id: newPaletteId(),
        name: newPaletteName(palettes),
        baseColor: DEFAULT_COLOUR,
      },
    ])
  }

  return (
    <Card
      title="Palettes"
      actions={
        <SegmentedControl
          mode="radio"
          aria-label="Colour format"
          size="sm"
          options={FORMAT_OPTIONS}
          value={format}
          onChange={setFormat}
        />
      }
    >
      <div className="flex flex-col gap-3">
        {palettes.map((p, i) => {
          const problem = problems[i]
          const messageId = `${idPrefix}-name-${i}`
          return (
            <div key={paletteKey(p, i)} className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updateName(i, e.target.value)}
                  className={[
                    'w-[140px]',
                    FIELD,
                    problem
                      ? 'border-danger'
                      : 'border-input hover:border-input-hover',
                  ].join(' ')}
                  placeholder="Palette name"
                  aria-label={`Name of palette ${i + 1}`}
                  aria-invalid={problem !== null}
                  aria-describedby={problem ? messageId : undefined}
                />

                <SimpleColorPicker
                  value={p.baseColor}
                  onChange={(colour) => updateBaseColor(i, colour)}
                  label={p.name || `Palette ${i + 1}`}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={() => removePalette(i)}
                  disabled={palettes.length <= 1}
                  title="Remove palette"
                  aria-label={`Remove ${p.name || `palette ${i + 1}`}`}
                >
                  <Icon data={close} size={16} />
                </Button>
              </div>
              {problem && (
                <p id={messageId} className="m-0 text-xs text-danger">
                  {nameProblemText(problem)}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <Button size="sm" onClick={addPalette} className="mt-3">
        <Icon data={add} size={16} />
        Add palette
      </Button>
    </Card>
  )
}
