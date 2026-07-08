'use client'

import { useState, useRef, useCallback } from 'react'
import { Plus, X, Pipette, ChevronDown, ChevronUp } from 'lucide-react'
import { SimpleColorPicker } from './SimpleColorPicker'
import { isValidColorFormat, parseColorToHex } from '@/utils/color'
import type { ColorAnchor } from '@/types'
import type { PaletteInput } from '@/utils/urlState'

type PaletteInputPanelProps = {
  palettes: PaletteInput[]
  onChange: (palettes: PaletteInput[]) => void
}

export function PaletteInputPanel({
  palettes,
  onChange,
}: PaletteInputPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

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
      anchors[anchorIndex] = { ...anchors[anchorIndex], value: newValue as string }
    } else {
      anchors[anchorIndex] = { ...anchors[anchorIndex], step: newValue as number }
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
    // Find first unused step
    let freeStep = 1
    for (let s = 1; s <= 15; s++) {
      if (!usedSteps.has(s)) {
        freeStep = s
        break
      }
    }
    const newAnchor: ColorAnchor = { value: 'oklch(0.5 0.05 180)', step: freeStep }
    next[paletteIndex] = { ...p, anchors: [...existingAnchors, newAnchor] }
    onChange(next)
  }

  const convertToAnchors = (paletteIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    const hex = p.baseColor.startsWith('#') ? p.baseColor : `#${p.baseColor}`
    next[paletteIndex] = {
      ...p,
      anchors: [{ value: hex, step: 9 }],
    }
    onChange(next)
  }

  const convertToSimple = (paletteIndex: number) => {
    const next = [...palettes]
    const p = next[paletteIndex]
    // Try to get hex from first anchor
    let hex = '808080'
    if (p.anchors && p.anchors.length > 0) {
      const parsed = parseColorToHex(p.anchors[0].value)
      if (parsed) hex = parsed.replace('#', '')
    }
    next[paletteIndex] = { ...p, baseColor: hex, anchors: undefined }
    onChange(next)
  }

  const removePalette = (index: number) => {
    if (palettes.length <= 1) return
    onChange(palettes.filter((_, i) => i !== index))
  }

  const addPalette = () => {
    onChange([
      ...palettes,
      { name: `Color ${palettes.length + 1}`, baseColor: '808080' },
    ])
  }

  const hasAnchors = (p: PaletteInput) => p.anchors && p.anchors.length > 0

  return (
    <section className="rounded-xl border border-neutral-subtle bg-default p-5">
      <h2 className="font-semibold text-sm mb-4">Palettes</h2>

      <div className="flex flex-col gap-3">
        {palettes.map((p, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* Main row: name + color preview + expand/collapse + remove */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={p.name}
                onChange={(e) => updateName(i, e.target.value)}
                className="w-[140px] px-2 py-1 text-sm rounded-md border border-neutral-subtle bg-default"
                placeholder="Palette name"
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
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          backgroundColor: hex ?? '#808080',
                          border: '1px solid rgba(128,128,128,0.3)',
                        }}
                      />
                    )
                  })}
                  <span className="text-xs text-subtle ml-1">
                    {p.anchors!.length} anchor{p.anchors!.length > 1 ? 's' : ''}
                  </span>
                </div>
              ) : (
                <SimpleColorPicker
                  value={p.baseColor}
                  onChange={(hex) => updateBaseColor(i, hex)}
                />
              )}

              <button
                type="button"
                onClick={() =>
                  setExpandedIndex(expandedIndex === i ? null : i)
                }
                className="cursor-pointer p-1 rounded-md border-none bg-transparent text-subtle hover:text-strong"
                title={expandedIndex === i ? 'Collapse' : 'Edit anchors'}
              >
                {expandedIndex === i ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => removePalette(i)}
                disabled={palettes.length <= 1}
                className="cursor-pointer p-1 rounded-md border-none bg-transparent text-subtle disabled:opacity-30"
                title="Remove palette"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded: anchor editing */}
            {expandedIndex === i && (
              <div
                className="ml-4 pl-4 flex flex-col gap-2"
                style={{ borderLeft: '2px solid var(--border-color-neutral-subtle, #e5e7eb)' }}
              >
                {hasAnchors(p) ? (
                  <>
                    {p.anchors!.map((anchor, ai) => (
                      <AnchorRow
                        key={ai}
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
                      <button
                        type="button"
                        onClick={() => addAnchor(i)}
                        className="flex items-center gap-1 cursor-pointer px-2 py-1 text-xs rounded-md border border-dashed border-neutral-subtle bg-transparent text-subtle hover:text-strong transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add anchor
                      </button>
                      <button
                        type="button"
                        onClick={() => convertToSimple(i)}
                        className="cursor-pointer px-2 py-1 text-xs rounded-md border border-neutral-subtle bg-transparent text-subtle hover:text-strong transition-colors"
                      >
                        Switch to simple
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-subtle">
                      Single color mode
                    </span>
                    <button
                      type="button"
                      onClick={() => convertToAnchors(i)}
                      className="cursor-pointer px-2 py-1 text-xs rounded-md border border-neutral-subtle bg-transparent text-subtle hover:text-strong transition-colors"
                    >
                      Switch to anchors
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPalette}
        className="flex items-center gap-1.5 cursor-pointer mt-3 px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-neutral-subtle bg-transparent text-subtle hover:text-strong transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add palette
      </button>
    </section>
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
  const [localValue, setLocalValue] = useState(anchor.value)
  const [isValid, setIsValid] = useState(true)

  const localHex = (() => {
    try {
      return parseColorToHex(anchor.value) ?? '#808080'
    } catch {
      return '#808080'
    }
  })()

  const handleValueChange = useCallback(
    (val: string) => {
      setLocalValue(val)
      const valid = isValidColorFormat(val)
      setIsValid(valid)
      if (valid) {
        onUpdate('value', val.trim())
      }
    },
    [onUpdate],
  )

  const handleBlur = useCallback(() => {
    if (!isValid) {
      setLocalValue(anchor.value)
      setIsValid(true)
    }
  }, [isValid, anchor.value])

  return (
    <div className="flex items-center gap-2">
      <select
        value={anchor.step}
        onChange={(e) => onUpdate('step', parseInt(e.target.value))}
        className="px-2 py-1 text-xs rounded-md border border-neutral-subtle bg-default"
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
        value={localValue}
        onChange={(e) => handleValueChange(e.target.value)}
        onBlur={handleBlur}
        className={[
          'flex-1 min-w-0 px-2 py-1 text-xs font-mono rounded-md',
          isValid
            ? 'border border-neutral-subtle'
            : 'border-2 border-danger-fill-emphasis-default',
          'bg-default',
        ].join(' ')}
        aria-label={`Color value for anchor ${index + 1}`}
        aria-invalid={!isValid}
      />

      <input
        ref={colorInputRef}
        type="color"
        value={localHex}
        onChange={(e) => {
          setLocalValue(e.target.value)
          setIsValid(true)
          onUpdate('value', e.target.value)
        }}
        className="sr-only"
        tabIndex={-1}
      />
      <button
        type="button"
        onClick={() => colorInputRef.current?.click()}
        className="cursor-pointer p-1 rounded-md border-none bg-transparent text-subtle hover:text-strong"
        title="Pick color"
      >
        <Pipette className="w-3.5 h-3.5" />
      </button>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer p-1 rounded-md border-none bg-transparent text-subtle hover:text-strong"
          title="Remove anchor"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
