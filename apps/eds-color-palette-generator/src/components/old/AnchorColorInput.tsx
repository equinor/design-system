'use client'
import { useState, useRef, useEffect } from 'react'
import { close, dropper } from '@equinor/eds-icons'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'
import { isValidColorFormat, parseColorToHex } from '@/utils/color'
import { ColorAnchor } from '@/types'

type AnchorColorInputProps = {
  index: number
  anchor: ColorAnchor
  anchors: ColorAnchor[]
  onUpdateAnchor: (
    index: number,
    field: 'value' | 'step',
    newValue: string | number,
  ) => void
  onRemoveAnchor: (index: number) => void
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

/**
 * AnchorColorInput component for editing a single color anchor
 * Provides inputs for color value and step position, along with a color picker
 */
export function AnchorColorInput({
  index,
  anchor,
  anchors,
  onUpdateAnchor,
  onRemoveAnchor,
  testId,
}: AnchorColorInputProps) {
  const colorInputRef = useRef<HTMLInputElement | null>(null)
  const [localHex, setLocalHex] = useState(() => {
    try {
      return parseColorToHex(anchor.value) || '#000000'
    } catch {
      return '#000000'
    }
  })
  const [localColorInput, setLocalColorInput] = useState(anchor.value)
  const [isValidColor, setIsValidColor] = useState(true)
  const debounceRef = useRef<number | null>(null)

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
          onUpdateAnchor(index, 'value', value.trim())
        }, 250)
      }
    }
  }

  const handleColorInputBlur = () => {
    if (!isValidColor) {
      setLocalColorInput(anchor.value)
      setIsValidColor(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {anchors.length > 1 && (
        <select
          value={anchor.step}
          onChange={(e) =>
            onUpdateAnchor(index, 'step', parseInt(e.target.value))
          }
          className="px-2 py-1.5 text-sm text-primary rounded border border-input hover:border-input-hover focus:border-emphasis bg-input"
          aria-label={`Step for anchor ${index + 1}`}
          data-testid={testId ? `${testId}-anchor-${index}-step` : undefined}
        >
          {Array.from({ length: 15 }, (_, i) => i + 1).map((step) => {
            const isUsed = isStepAlreadyUsed(anchors, step, index)
            return (
              <option
                key={step}
                value={step}
                disabled={isUsed}
                aria-label={
                  isUsed
                    ? `Step ${step} (unavailable - already used by another anchor)`
                    : `Step ${step}`
                }
              >
                Step {step}
                {isUsed ? ' (used)' : ''}
              </option>
            )
          })}
        </select>
      )}
      <div className="flex flex-col gap-1 flex-1">
        <input
          type="text"
          value={localColorInput}
          onChange={(e) => handleColorInputChange(e.target.value)}
          onBlur={handleColorInputBlur}
          placeholder="Color value"
          className={`px-3 py-1.5 text-sm text-primary rounded ${
            !isValidColor
              ? 'border-2 border-danger'
              : 'border border-input hover:border-input-hover focus:border-emphasis'
          } bg-input`}
          aria-label={`Color value for anchor ${index + 1}`}
          aria-invalid={!isValidColor}
          data-testid={testId ? `${testId}-anchor-${index}-value` : undefined}
        />
        {!isValidColor && (
          <span
            className="text-sm text-danger"
            data-testid={
              testId ? `${testId}-anchor-${index}-format-error` : undefined
            }
          >
            Color format is not valid
          </span>
        )}
      </div>
      <input
        ref={colorInputRef}
        type="color"
        value={localHex}
        onChange={(e) => {
          const next = e.target.value
          setLocalHex(next)
          setLocalColorInput(next)
          setIsValidColor(true)
          onUpdateAnchor(index, 'value', next)
        }}
        className="sr-only"
        aria-label={`Pick color for anchor ${index + 1}`}
        tabIndex={-1}
      />
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={() => colorInputRef.current?.click()}
        className="print-hide"
        title="Pick color"
        aria-label={`Pick color for anchor ${index + 1}`}
        data-testid={testId ? `${testId}-anchor-${index}-picker` : undefined}
      >
        <Icon data={dropper} size={16} />
      </Button>
      {anchors.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={() => onRemoveAnchor(index)}
          className="print-hide"
          title="Remove anchor"
          aria-label={`Remove anchor ${index + 1}`}
          data-testid={testId ? `${testId}-anchor-${index}-remove` : undefined}
        >
          <Icon data={close} size={16} />
        </Button>
      )}
    </div>
  )
}
