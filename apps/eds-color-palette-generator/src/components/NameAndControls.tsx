'use client'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Trash, Pipette, Plus } from 'lucide-react'
import { isValidColorFormat, parseColorToHex } from '@/utils/color'
import { DEFAULT_ANCHOR_COLOR } from '@/utils/constants'
import { findAvailableStep } from '@/utils/stepSelection'
import { ColorAnchor } from '@/types'
import { AnchorColorInput } from './AnchorColorInput'

type NameAndControlsProps = {
  name?: string
  headingColor: string
  baseColor?: string
  anchors?: ColorAnchor[]
  onRename?: (n: string) => void
  onChangeValue?: (v: string) => void
  onChangeAnchors?: (anchors: ColorAnchor[]) => void
  onRemove?: () => void
  testId?: string
}

/**
 * Helper function to check if a step value is already used by another anchor
 */
function isStepAlreadyUsed(
  anchors: ColorAnchor[],
  stepValue: number,
  excludeIndex: number,
): boolean {
  return anchors.some((a, idx) => a.step === stepValue && idx !== excludeIndex)
}

// Use useLayoutEffect on client, useEffect on server (SSR safe)
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function NameAndControlsBase({
  name,
  headingColor,
  baseColor,
  anchors,
  onRename,
  onChangeValue,
  onChangeAnchors,
  onRemove,
  testId,
}: NameAndControlsProps) {
  const colorInputRef = useRef<HTMLInputElement | null>(null)
  const prevBaseColorRef = useRef<string | undefined>(baseColor)
  const [localHex, setLocalHex] = useState(baseColor || '#000000')
  const [localColorInput, setLocalColorInput] = useState(baseColor || '#000000')
  const [isValidColor, setIsValidColor] = useState(true)
  const debounceRef = useRef<number | null>(null)

  // Determine if we're in anchor mode
  const isAnchorMode = anchors && anchors.length > 0

  // Sync local state when baseColor prop changes externally
  // Using useLayoutEffect to avoid visual flicker
  useIsomorphicLayoutEffect(() => {
    if (prevBaseColorRef.current !== baseColor) {
      prevBaseColorRef.current = baseColor
      setLocalHex(baseColor || '#000000')
      setLocalColorInput(baseColor || '#000000')
      setIsValidColor(true)
    }
  }, [baseColor])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const handleColorInputChange = (value: string) => {
    setLocalColorInput(value)
    const isValid = isValidColorFormat(value)
    setIsValidColor(isValid)

    if (isValid) {
      const hexValue = parseColorToHex(value)
      if (hexValue) {
        setLocalHex(hexValue)
        // Debounce the parent update
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
        debounceRef.current = window.setTimeout(() => {
          onChangeValue?.(value.trim())
        }, 250)
      }
    }
  }

  const handleColorInputBlur = () => {
    if (!isValidColor) {
      setLocalColorInput(baseColor || '#000000')
      setIsValidColor(true)
    }
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setLocalHex(next)
    setLocalColorInput(next)
    setIsValidColor(true)
    // Debounce the parent update
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = window.setTimeout(() => {
      onChangeValue?.(next)
    }, 250)
  }

  const handleAddSecondColor = () => {
    if (baseColor && onChangeAnchors) {
      onChangeAnchors([
        { value: baseColor, step: 1 },
        { value: baseColor, step: 15 },
      ])
    }
  }

  const handleUpdateAnchor = (
    index: number,
    field: 'value' | 'step',
    newValue: string | number,
  ) => {
    if (!anchors || !onChangeAnchors) return
    const newAnchors = [...anchors]
    if (field === 'value' && typeof newValue === 'string') {
      newAnchors[index] = { ...newAnchors[index], value: newValue }
    } else if (field === 'step' && typeof newValue === 'number') {
      if (isStepAlreadyUsed(anchors, newValue, index)) {
        window.alert(
          'Step value already used by another anchor. Please choose a unique step.',
        )
        return
      }
      newAnchors[index] = { ...newAnchors[index], step: newValue }
    }
    onChangeAnchors(newAnchors)
  }

  const handleAddAnchor = () => {
    if (!anchors || !onChangeAnchors) return
    const usedSteps = anchors.map((a) => a.step)

    if (usedSteps.length >= 15) {
      window.alert(
        'All 15 steps are already in use. Remove an anchor before adding a new one.',
      )
      return
    }

    const newStep = findAvailableStep(usedSteps)
    onChangeAnchors([
      ...anchors,
      { value: anchors[0]?.value || DEFAULT_ANCHOR_COLOR, step: newStep },
    ])
  }

  const handleRemoveAnchor = (index: number) => {
    if (!anchors || !onChangeAnchors || anchors.length <= 1) return
    const newAnchors = anchors.filter((_, i) => i !== index)
    onChangeAnchors(newAnchors)
  }

  return (
    <div className="mb-4 print:mb-0">
      {/* Color name input (always shown) */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={name ?? ''}
          onChange={(e) => onRename?.(e.target.value)}
          placeholder="Color name"
          className="min-w-0 max-w-40 flex-1 px-3 py-1.5 rounded-md border border-transparent hover:border-neutral-subtle focus:border-neutral-strong focus:bg-canvas bg-surface text-strong font-medium"
          style={{ color: headingColor }}
          aria-label="Color name"
          data-testid={testId ? `${testId}-input-name` : undefined}
        />
        <button
          type="button"
          onClick={() => onRemove?.()}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md border-neutral-subtle hover:bg-neutral-fill-muted-hover print-hide"
          title="Remove color"
          aria-label="Remove color"
          data-testid={testId ? `${testId}-remove-button` : undefined}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {/* Single color mode (legacy) */}
      {!isAnchorMode && (
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <input
              type="text"
              value={localColorInput}
              onChange={(e) => handleColorInputChange(e.target.value)}
              onBlur={handleColorInputBlur}
              placeholder="Any color format"
              className={`px-3 py-1.5 text-sm rounded-md ${
                !isValidColor
                  ? 'border-2 border-danger-fill-emphasis-default'
                  : 'border border-neutral-subtle hover:border-neutral-medium focus:border-neutral-strong'
              } bg-input`}
              aria-label={`Base color for ${name ?? 'color'}`}
              aria-invalid={!isValidColor}
              data-testid={testId ? `${testId}-input-color` : undefined}
            />
            {!isValidColor && (
              <span
                className="text-xs text-danger-subtle"
                data-testid={testId ? `${testId}-format-error` : undefined}
              >
                Color format is not valid
              </span>
            )}
          </div>
          <input
            ref={colorInputRef}
            type="color"
            value={localHex}
            onChange={handleColorPickerChange}
            className="sr-only"
            aria-label={`Pick base color for ${name ?? 'color'}`}
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-fill-muted-hover print-hide"
            title="Pick color"
            aria-label="Pick color"
            data-testid={testId ? `${testId}-color-picker` : undefined}
          >
            <Pipette className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleAddSecondColor}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-fill-muted-hover border border-neutral-subtle print-hide"
            title="Add second color"
            aria-label="Add second color"
            data-testid={testId ? `${testId}-add-second-color` : undefined}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Anchor mode (multi-color) */}
      {isAnchorMode && anchors && (
        <div className="space-y-2">
          {anchors.map((anchor, index) => (
            <AnchorColorInput
              key={`anchor-${anchor.step}`}
              index={index}
              anchor={anchor}
              anchors={anchors}
              onUpdateAnchor={handleUpdateAnchor}
              onRemoveAnchor={handleRemoveAnchor}
              testId={testId}
            />
          ))}
          <button
            type="button"
            onClick={handleAddAnchor}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-neutral-fill-muted-hover border border-neutral-subtle print-hide"
            title="Add anchor"
            aria-label="Add anchor"
            data-testid={testId ? `${testId}-add-anchor` : undefined}
          >
            <Plus className="w-4 h-4" />
            Add anchor
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Custom memo comparison - excludes callback props since we expect them to be stable
 */
function areNameAndControlsEqual(
  prev: NameAndControlsProps,
  next: NameAndControlsProps,
) {
  if (
    prev.name !== next.name ||
    prev.baseColor !== next.baseColor ||
    prev.headingColor !== next.headingColor ||
    prev.testId !== next.testId
  ) {
    return false
  }

  const prevAnchors = prev.anchors
  const nextAnchors = next.anchors

  if (!prevAnchors && !nextAnchors) return true
  if (!prevAnchors || !nextAnchors) return false
  if (prevAnchors.length !== nextAnchors.length) return false

  return prevAnchors.every(
    (anchor, i) =>
      anchor.value === nextAnchors[i].value &&
      anchor.step === nextAnchors[i].step,
  )
}

export const NameAndControls = React.memo(
  NameAndControlsBase,
  areNameAndControlsEqual,
)
