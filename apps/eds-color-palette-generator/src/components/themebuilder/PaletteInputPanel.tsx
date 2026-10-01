'use client'

import { useState, useRef, useCallback } from 'react'
import {
  add,
  chevron_down,
  chevron_up,
  close,
  dropper,
} from '@equinor/eds-icons'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { Icon } from '@/components/shared/Icon'
import { SimpleColorPicker } from './SimpleColorPicker'
import {
  isValidColorFormat,
  parseColorToHex,
  toCssColor,
  toOklchString,
} from '@/utils/color'
import type { ColorAnchor, ColorFormat } from '@/types'
import { newPaletteId, type PaletteInput } from '@/utils/urlState'
import { useColorFormat } from '@/context/ColorFormatContext'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'

/** A mid grey, for new palettes */
const DEFAULT_COLOUR = 'oklch(0.6 0 0)'

const STEPS = 15

/**
 * "Colour N" for a new palette, with N past any name already taken. Several
 * views and the Tokens Studio download tell palettes apart by name.
 */
function newPaletteName(palettes: PaletteInput[]): string {
  const taken = new Set(palettes.map((p) => p.name))
  let n = palettes.length + 1
  while (taken.has(`Colour ${n}`)) n++
  return `Colour ${n}`
}

// How colour values are shown on the whole Theme Builder page. OKLCH is the
// canonical form (ADR 0016 D9); palettes are stored in OKLCH either way.
const FORMAT_OPTIONS: SegmentedOption<ColorFormat>[] = [
  { value: 'OKLCH', label: 'OKLCH' },
  { value: 'HEX', label: 'HEX' },
]

const FIELD =
  'rounded border bg-input px-2 py-1 text-sm text-primary border-input hover:border-input-hover'

type PaletteInputPanelProps = {
  palettes: PaletteInput[]
  onChange: (palettes: PaletteInput[]) => void
}

export function PaletteInputPanel({
  palettes,
  onChange,
}: PaletteInputPanelProps) {
  const { format, setFormat } = useColorFormat()
  // Track the expanded row by id, so removing a row above it does not move
  // the expansion to another palette.
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const updateName = (index: number, name: string) => {
    const next = [...palettes]
    next[index] = { ...next[index], name }
    onChange(next)
  }

  const updateBaseColor = (index: number, baseColor: string) => {
    const next = [...palettes]
    next[index] = { ...next[index], baseColor, anchors: undefined }
    onChange(next)
  }

  const updateAnchor = (
    paletteIndex: number,
    anchorIndex: number,
    field: 'value' | 'step',
    newValue: string | number,
  ) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    if (!p.anchors) return
    const anchors = [...p.anchors]
    if (field === 'value') {
      anchors[anchorIndex] = {
        ...anchors[anchorIndex],
        value: newValue as string,
      }
    } else {
      anchors[anchorIndex] = {
        ...anchors[anchorIndex],
        step: newValue as number,
      }
    }
    next[paletteIndex] = { ...p, anchors }
    onChange(next)
  }

  const removeAnchor = (paletteIndex: number, anchorIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    if (!p.anchors || p.anchors.length <= 1) return
    const anchors = p.anchors.filter((_, i) => i !== anchorIndex)
    next[paletteIndex] = { ...p, anchors }
    onChange(next)
  }

  const addAnchor = (paletteIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    const existingAnchors = p.anchors ?? []
    const usedSteps = new Set(existingAnchors.map((a) => a.step))
    const freeStep = Array.from({ length: STEPS }, (_, i) => i + 1).find(
      (step) => !usedSteps.has(step),
    )
    // Every step has an anchor; the button is disabled then
    if (freeStep === undefined) return
    const newAnchor: ColorAnchor = {
      value: 'oklch(0.5 0.05 180)',
      step: freeStep,
    }
    next[paletteIndex] = { ...p, anchors: [...existingAnchors, newAnchor] }
    onChange(next)
  }

  const convertToAnchors = (paletteIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    next[paletteIndex] = {
      ...p,
      anchors: [{ value: toCssColor(p.baseColor), step: 9 }],
    }
    onChange(next)
  }

  const convertToSimple = (paletteIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    // Keep the first anchor, in OKLCH
    const first = p.anchors?.[0]?.value
    const baseColor = (first && toOklchString(first)) ?? DEFAULT_COLOUR
    next[paletteIndex] = { ...p, baseColor, anchors: undefined }
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

  const hasAnchors = (p: PaletteInput) => p.anchors && p.anchors.length > 0

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
          const rowId = p.id ?? String(i)
          const expanded = expandedId === rowId
          return (
            <div key={rowId} className="flex flex-col gap-2">
              {/* Main row: name + color preview + expand/collapse + remove */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updateName(i, e.target.value)}
                  className={`w-[140px] ${FIELD}`}
                  placeholder="Palette name"
                  aria-label={`Name of palette ${i + 1}`}
                />

                {hasAnchors(p) ? (
                  // Multi-anchor: show colored dots for each anchor
                  <div className="flex items-center gap-1">
                    {p.anchors!.map((a, ai) => {
                      const hex = parseColorToHex(a.value)
                      return (
                        <span
                          key={ai}
                          title={`Step ${a.step}: ${a.value}`}
                          className="inline-block size-5 rounded border border-muted"
                          style={{ backgroundColor: hex ?? '#808080' }}
                        />
                      )
                    })}
                    <span className="ml-1 text-sm text-secondary">
                      {p.anchors!.length} anchor
                      {p.anchors!.length > 1 ? 's' : ''}
                    </span>
                  </div>
                ) : (
                  <SimpleColorPicker
                    value={p.baseColor}
                    onChange={(hex) => updateBaseColor(i, hex)}
                    label={p.name || `Palette ${i + 1}`}
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={() => setExpandedId(expanded ? null : rowId)}
                  title={expanded ? 'Collapse' : 'Edit anchors'}
                  aria-label={`${expanded ? 'Collapse' : 'Edit anchors for'} ${p.name || `palette ${i + 1}`}`}
                  aria-expanded={expanded}
                >
                  <Icon data={expanded ? chevron_up : chevron_down} size={16} />
                </Button>

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

              {/* Expanded: anchor editing */}
              {expanded && (
                <div className="ml-4 flex flex-col gap-2 border-l-2 border-muted pl-4">
                  {hasAnchors(p) ? (
                    <>
                      {p.anchors!.map((anchor, ai) => (
                        <AnchorRow
                          // Steps are unique within a palette, so the step
                          // keeps each row's local input state with its anchor.
                          key={anchor.step}
                          anchor={anchor}
                          allAnchors={p.anchors!}
                          index={ai}
                          onUpdate={(field, val) =>
                            updateAnchor(i, ai, field, val)
                          }
                          onRemove={() => removeAnchor(i, ai)}
                          canRemove={p.anchors!.length > 1}
                        />
                      ))}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => addAnchor(i)}
                          disabled={p.anchors!.length >= STEPS}
                        >
                          <Icon data={add} size={16} />
                          Add anchor
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => convertToSimple(i)}
                        >
                          Switch to simple
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-secondary">
                        Single colour mode
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => convertToAnchors(i)}
                      >
                        Switch to anchors
                      </Button>
                    </div>
                  )}
                </div>
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

/* ------------------------------------------------------------------ */
/*  Anchor row sub-component                                           */
/* ------------------------------------------------------------------ */

function AnchorRow({
  anchor,
  allAnchors,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: {
  anchor: ColorAnchor
  allAnchors: ColorAnchor[]
  index: number
  onUpdate: (field: 'value' | 'step', val: string | number) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { format, formatColour } = useColorFormat()
  // What the user is typing; only valid colours reach the anchor, and leaving
  // the field shows the stored anchor again in the page's format.
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? formatColour(anchor.value)
  const isValid = isValidColorFormat(shown)
  const anchorHex = parseColorToHex(toCssColor(anchor.value)) ?? '#808080'

  // Anchors are stored in OKLCH; a colour typed as hex is converted.
  const store = useCallback(
    (colour: string) =>
      onUpdate(
        'value',
        format === 'HEX' ? (toOklchString(colour) ?? colour) : colour.trim(),
      ),
    [format, onUpdate],
  )

  return (
    <div className="flex items-center gap-2">
      <select
        value={anchor.step}
        onChange={(e) => onUpdate('step', parseInt(e.target.value))}
        className={FIELD}
        aria-label={`Step for anchor ${index + 1}`}
      >
        {Array.from({ length: 15 }, (_, i) => i + 1).map((step) => {
          const isUsed = allAnchors.some(
            (a, idx) => a.step === step && idx !== index,
          )
          return (
            <option key={step} value={step} disabled={isUsed}>
              Step {step}
              {isUsed ? ' (used)' : ''}
            </option>
          )
        })}
      </select>

      <input
        type="text"
        value={shown}
        onChange={(e) => {
          setDraft(e.target.value)
          if (isValidColorFormat(e.target.value)) store(e.target.value)
        }}
        onBlur={() => setDraft(null)}
        spellCheck={false}
        className={[
          'min-w-0 flex-1 rounded bg-input px-2 py-1 font-mono text-sm text-primary',
          isValid
            ? 'border border-input hover:border-input-hover'
            : 'border-2 border-danger',
        ].join(' ')}
        aria-label={`Colour value for anchor ${index + 1}`}
        aria-invalid={!isValid}
      />

      <input
        ref={colorInputRef}
        type="color"
        value={anchorHex}
        onChange={(e) => {
          // The native picker works in hex; keep anchors in OKLCH
          setDraft(null)
          onUpdate('value', toOklchString(e.target.value) ?? e.target.value)
        }}
        className="sr-only"
        tabIndex={-1}
      />
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={() => colorInputRef.current?.click()}
        title="Pick colour"
        aria-label={`Pick colour for anchor ${index + 1}`}
      >
        <Icon data={dropper} size={16} />
      </Button>

      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={onRemove}
          title="Remove anchor"
          aria-label={`Remove anchor ${index + 1}`}
        >
          <Icon data={close} size={16} />
        </Button>
      )}
    </div>
  )
}
