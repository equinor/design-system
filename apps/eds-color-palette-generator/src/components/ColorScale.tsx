'use client'
import { PALETTE_STEPS } from '@/config/config'
import { getStepIndex } from '@/config/helpers'
import { contrast, isValidColorFormat, parseColorToHex } from '@/utils/color'
import { Trash, Pipette, Plus, X } from 'lucide-react'
import Color from 'colorjs.io'
import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useIsMounted } from '@equinor/eds-utils'
import { ColorAnchor } from '@/types'

type ColorScaleProps = {
  colors: string[]
  showContrast?: boolean
  contrastMethod?: 'WCAG21' | 'APCA'
  colorName?: string
  baseColor?: string
  anchors?: ColorAnchor[]
  onRename?: (newName: string) => void
  onChangeValue?: (newValue: string) => void
  onChangeAnchors?: (anchors: ColorAnchor[]) => void
  onRemove?: () => void
  /** Stable identifier for testing - should not change when name/value changes */
  testId?: string
}

// Type for color information in OKLCH format!
type OklchInfo = {
  l: number // lightness
  c: number // chroma
  h: number // hue
  value: string // original color value
  index: number // color step index
}

// Reusable component for anchor color input with picker
type AnchorColorInputProps = {
  index: number
  anchor: ColorAnchor
  anchorsLength: number
  onUpdateAnchor: (
    index: number,
    field: 'value' | 'step',
    newValue: string | number,
  ) => void
  onRemoveAnchor: (index: number) => void
  testId?: string
}

function AnchorColorInput({
  index,
  anchor,
  anchorsLength,
  onUpdateAnchor,
  onRemoveAnchor,
  testId,
}: AnchorColorInputProps) {
  const colorInputRef = useRef<HTMLInputElement | null>(null)
  const prevAnchorValueRef = useRef<string>(anchor.value)
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

  // Update local state when anchor value changes from parent
  useEffect(() => {
    if (prevAnchorValueRef.current !== anchor.value) {
      prevAnchorValueRef.current = anchor.value
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalColorInput(anchor.value)
      const hexValue = parseColorToHex(anchor.value)
      if (hexValue) {
        setLocalHex(hexValue)
        setIsValidColor(true)
      }
    }
  }, [anchor.value])

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
          window.clearTimeout(debounceRef.current)
        }
        debounceRef.current = window.setTimeout(() => {
          onUpdateAnchor(index, 'value', value.trim())
        }, 250)
      }
    }
  }

  const handleColorInputBlur = () => {
    if (!isValidColor) {
      // Reset to last valid value on blur if invalid
      setLocalColorInput(anchor.value)
      setIsValidColor(true)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {anchorsLength > 1 && (
        <select
          value={anchor.step}
          onChange={(e) =>
            onUpdateAnchor(index, 'step', parseInt(e.target.value))
          }
          className="px-2 py-1.5 text-sm rounded-md border border-neutral-subtle hover:border-neutral-medium focus:border-neutral-strong bg-input"
          aria-label={`Step for anchor ${index + 1}`}
          data-testid={testId ? `${testId}-anchor-${index}-step` : undefined}
        >
          {Array.from({ length: 15 }, (_, i) => i + 1).map((step) => {
            // Find if this step is used by another anchor
            const isUsed =
              anchors.some(
                (a, idx) => a.step === step && idx !== index
              );
            return (
              <option key={step} value={step} disabled={isUsed}>
                Step {step}
                {isUsed ? ' (used)' : ''}
              </option>
            );
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
          className={`px-3 py-1.5 text-sm rounded-md ${
            !isValidColor
              ? 'border-2 border-danger-fill-emphasis-default'
              : 'border border-neutral-subtle hover:border-neutral-medium focus:border-neutral-strong'
          } bg-input`}
          aria-label={`Color value for anchor ${index + 1}`}
          aria-invalid={!isValidColor}
          data-testid={testId ? `${testId}-anchor-${index}-value` : undefined}
        />
        {!isValidColor && (
          <span
            className="text-xs text-danger-subtle"
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
      <button
        type="button"
        onClick={() => colorInputRef.current?.click()}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-fill-muted-hover print-hide"
        title="Pick color"
        aria-label={`Pick color for anchor ${index + 1}`}
        data-testid={testId ? `${testId}-anchor-${index}-picker` : undefined}
      >
        <Pipette className="w-4 h-4" />
      </button>
      {anchorsLength > 1 && (
        <button
          type="button"
          onClick={() => onRemoveAnchor(index)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-neutral-fill-muted-hover print-hide"
          title="Remove anchor"
          aria-label={`Remove anchor ${index + 1}`}
          data-testid={testId ? `${testId}-anchor-${index}-remove` : undefined}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// Function to determine text color for steps
function getTextColorForStep(colors: string[], stepIndex: number): string {
  if (stepIndex >= 9 && stepIndex <= 13) {
    return colors[14] // text inverted strong
  }

  return colors[12] // text strong
}

function getSystemTextColorClassNameForStep({
  stepIndex,
  status,
}: {
  stepIndex: number
  status: 'success' | 'danger'
}): string {
  if (stepIndex >= 9 && stepIndex <= 13) {
    return `text-${status}-subtle-on-emphasis`
  }

  return `text-${status}-subtle`
}

// Convert color string to OKLCH format
function getOklchInfo(colorValue: string, index: number): OklchInfo {
  try {
    const color = new Color(colorValue)
    const oklch = color.to('oklch')

    return {
      l: parseFloat(oklch.l.toFixed(3)),
      c: parseFloat(oklch.c.toFixed(3)),
      h: parseFloat((isNaN(oklch.h) ? 0 : oklch.h).toFixed(1)),
      value: colorValue,
      index: index,
    }
  } catch (error) {
    console.error(`Error converting color ${colorValue} to OKLCH:`, error)
    return {
      l: 0,
      c: 0,
      h: 0,
      value: colorValue,
      index: index,
    }
  }
}

function ColorScaleBase({
  colors,
  showContrast = true,
  contrastMethod = 'WCAG21',
  colorName,
  baseColor,
  anchors,
  onRename,
  onChangeValue,
  onChangeAnchors,
  onRemove,
  testId,
}: ColorScaleProps) {
  const isMounted = useIsMounted()

  // State to track the active dialog (index of the color) - only one can be active at a time
  const [activeDialog, setActiveDialog] = useState<number | null>(null)

  // State to track which color's hex value was recently copied
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null)

  // Create refs for dialogs and their corresponding color elements
  const dialogRefs = useRef<(HTMLDialogElement | null)[]>(
    Array(colors.length).fill(null),
  )
  const colorElementRefs = useRef<(HTMLDivElement | null)[]>(
    Array(colors.length).fill(null),
  )
  const headingColor = colors[8] || '#000000'

  // Stable, memoized header component to isolate frequent re-renders
  const NameAndControls = React.useMemo(() => {
    return React.memo(
      function NameAndControlsInner({
        name,
        headingColor,
        baseColor,
        anchors,
        onRename,
        onChangeValue,
        onChangeAnchors,
        onRemove,
        testId,
      }: {
        name?: string
        headingColor: string
        baseColor?: string
        anchors?: ColorAnchor[]
        onRename?: (n: string) => void
        onChangeValue?: (v: string) => void
        onChangeAnchors?: (anchors: ColorAnchor[]) => void
        onRemove?: () => void
        testId?: string
      }) {
        const colorInputRef = useRef<HTMLInputElement | null>(null)
        const prevBaseColorRef = useRef<string | undefined>(baseColor)
        const [localHex, setLocalHex] = useState(baseColor || '#000000')
        const [localColorInput, setLocalColorInput] = useState(
          baseColor || '#000000',
        )
        const [isValidColor, setIsValidColor] = useState(true)
        const debounceRef = useRef<number | null>(null)

        // Determine if we're in anchor mode
        const isAnchorMode = anchors && anchors.length > 0

        useEffect(() => {
          if (prevBaseColorRef.current !== baseColor) {
            prevBaseColorRef.current = baseColor
            setLocalHex(baseColor || '#000000')
            setLocalColorInput(baseColor || '#000000')
            setIsValidColor(true)
          }
        }, [baseColor])

        // Reusable debounced color change handler
        const debouncedColorChange = (value: string) => {
          if (debounceRef.current) {
            window.clearTimeout(debounceRef.current)
          }
          debounceRef.current = window.setTimeout(() => {
            onChangeValue?.(value)
          }, 250)
        }

        const handleColorInputChange = (value: string) => {
          setLocalColorInput(value)
          const isValid = isValidColorFormat(value)
          setIsValidColor(isValid)

          if (isValid) {
            // Convert to HEX for the color picker, but pass original format to parent
            const hexValue = parseColorToHex(value)
            if (hexValue) {
              setLocalHex(hexValue)
              // Pass the original value to maintain format (OKLCH, RGB, HSL, etc.)
              debouncedColorChange(value.trim())
            }
          }
        }

        const handleColorInputBlur = () => {
          if (!isValidColor) {
            // Reset to last valid value on blur if invalid
            setLocalColorInput(baseColor || '#000000')
            setIsValidColor(true)
          }
        }

        // Anchor-related handlers
        const handleAddSecondColor = () => {
          // Convert from single value to anchor mode
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
            newAnchors[index] = { ...newAnchors[index], step: newValue }
          }
          onChangeAnchors(newAnchors)
        }

        const handleAddAnchor = () => {
          if (!anchors || !onChangeAnchors) return
          // Find an available step (one that's not already used)
          const usedSteps = anchors.map((a) => a.step)
          let newStep = 8 // Default to middle step
          for (let i = 1; i <= 15; i++) {
            if (!usedSteps.includes(i)) {
              newStep = i
              break
            }
          }
          onChangeAnchors([
            ...anchors,
            { value: anchors[0]?.value || '#888888', step: newStep },
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
                      data-testid={
                        testId ? `${testId}-format-error` : undefined
                      }
                    >
                      Colour format is not valid
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
                    debouncedColorChange(next)
                  }}
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
                  data-testid={
                    testId ? `${testId}-add-second-color` : undefined
                  }
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
                    key={index}
                    index={index}
                    anchor={anchor}
                    anchorsLength={anchors.length}
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
      },
      (prev, next) => {
        // Check basic props
        if (
          prev.name !== next.name ||
          prev.baseColor !== next.baseColor ||
          prev.headingColor !== next.headingColor ||
          prev.testId !== next.testId
        ) {
          return false
        }

        // Check anchors - need deep comparison
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
      },
    )
  }, [])

  // Styles are now imported from the dialog.css file

  // Toggle dialog visibility
  const toggleDialog = (index: number) => {
    if (activeDialog === index) {
      // Close the dialog if already open
      const dialog = dialogRefs.current[index]
      if (dialog) {
        dialog.close()
      }
      setActiveDialog(null)
    } else {
      // Close any existing dialog first
      if (activeDialog !== null) {
        const previousDialog = dialogRefs.current[activeDialog]
        if (previousDialog) {
          previousDialog.close()
        }
      }

      // Open the new dialog (centered by default via CSS)
      const dialog = dialogRefs.current[index]
      if (dialog) {
        // Show the dialog - will be centered via CSS
        dialog.showModal()
        setActiveDialog(index)
      }
    }
  }

  // Close dialog function
  const closeDialog = (index: number) => {
    const dialog = dialogRefs.current[index]
    if (dialog) {
      dialog.close()
      setActiveDialog(null)
    }
  }

  // Handle dialog closing when it's closed via ESC key
  const handleDialogClose = () => {
    setActiveDialog(null)
  }

  // Copy to clipboard function
  const copyToClipboard = async (text: string, colorIndex: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedColorIndex(colorIndex)
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedColorIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedColorIndex(colorIndex)
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedColorIndex(null), 2000)
    }
  }

  // Effect to prevent dialog from closing when clicking inside it
  useEffect(() => {
    const handleDialogClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'DIALOG' && activeDialog !== null) {
        const currentDialogElement = dialogRefs.current[activeDialog]

        if (currentDialogElement === target) {
          event.stopPropagation()
        }
      }
    }

    document.addEventListener('click', handleDialogClick)

    return () => {
      document.removeEventListener('click', handleDialogClick)
    }
  }, [activeDialog])

  // Memoize contrast calculations to only recalculate when colors or contrastMethod change
  const contrasts = useMemo(() => {
    return colors.map((color: string, i: number) => {
      const step = PALETTE_STEPS[i]
      if (!step?.contrastWith || step.contrastWith.length === 0) return null

      const contrastForAllBackgroundPairings = step.contrastWith
        .map((contrastReq) => {
          const targetStepIndex = getStepIndex(contrastReq.targetStep)(
            PALETTE_STEPS,
          )
          if (targetStepIndex === -1) return null

          const contrastResult = contrast({
            foreground: color,
            background: colors[targetStepIndex],
            algorithm: contrastMethod,
          })
          return contrastResult
        })
        .filter((result) => result !== null)

      return contrastForAllBackgroundPairings
    })
  }, [colors, contrastMethod])

  // Only render on client to avoid hydration issues
  if (!isMounted) {
    return null
  }

  return (
    <div className="mb-8 print:mb-0">
      <NameAndControls
        name={colorName}
        headingColor={headingColor}
        baseColor={baseColor}
        anchors={anchors}
        onRename={onRename}
        onChangeValue={onChangeValue}
        onChangeAnchors={onChangeAnchors}
        onRemove={onRemove}
        testId={testId}
      />
      <div className="grid gap-2 mb-4 grid-cols-15 print:mb-0 print:gap-0">
        {colors.map((color: string, i: number) => {
          const textColor = getTextColorForStep(colors, i + 1)
          const step = PALETTE_STEPS[i]
          const pairsWithSteps = step?.contrastWith || []
          const oklchInfo = getOklchInfo(color, i)
          const isDialogActive = activeDialog === i
          const stepTestId = testId ? `${testId}-step-${i}` : `color-step-${i}`

          return (
            <div
              data-testid={stepTestId}
              key={'color-step-' + i}
              ref={(el) => {
                colorElementRefs.current[i] = el
              }}
              className={`color-scale-item rounded-lg p-3 transition-transform hover:scale-105 relative cursor-pointer print:rounded-none ${
                !showContrast ? 'aspect-square' : 'min-h-[130px]'
              }`}
              style={{ backgroundColor: color, color: textColor }}
              onClick={() => toggleDialog(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleDialog(i)
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isDialogActive}
              aria-label={`Color ${i + 1}: ${oklchInfo.value}, Click for details`}
              aria-controls={`color-dialog-${i}`}
            >
              {/* Native dialog for color information */}
              <dialog
                ref={(el) => {
                  dialogRefs.current[i] = el
                  return undefined
                }}
                id={`color-dialog-${i}`}
                className="min-w-[320px] backdrop:bg-black/20 cursor-default"
                style={{
                  backgroundColor: colors[0],
                  color: colors[12],
                }}
                onClose={handleDialogClose}
                aria-labelledby={`color-details-heading-${i}`}
                onClick={(e) => {
                  // Close dialog only if clicking directly on the backdrop
                  // (native dialog behavior is to close when clicking anywhere)
                  const rect = e.currentTarget.getBoundingClientRect()
                  const isInDialog =
                    rect.top <= e.clientY &&
                    e.clientY <= rect.bottom &&
                    rect.left <= e.clientX &&
                    e.clientX <= rect.right

                  // If click is inside the dialog, prevent default closing
                  if (isInDialog) {
                    e.stopPropagation()
                  } else {
                    closeDialog(i)
                  }
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4
                    id={`color-details-heading-${i}`}
                    className="text-lg font-medium"
                  >
                    {colorName ? `${colorName} ${i + 1}` : `Color ${i + 1}`}
                  </h4>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-full w-7 h-7 hover:bg-black/10 focus:outline-none focus:ring-2"
                    onClick={() => closeDialog(i)}
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>

                {/* Color sample */}
                <div className="flex gap-4 mb-4">
                  <div
                    className="w-16 h-16 border rounded-lg"
                    style={{
                      backgroundColor: oklchInfo.value,
                      borderColor: 'rgba(0,0,0,0.1)',
                    }}
                    aria-label={`Color sample: ${oklchInfo.value}`}
                  ></div>

                  <div className="flex flex-col justify-center">
                    <button
                      className="flex items-center gap-2 px-2 py-1 mb-2 -mx-2 font-mono text-base text-left rounded hover:bg-black/10 dark:hover:bg-white/10 group"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(oklchInfo.value, i)
                      }}
                      aria-label={`Copy ${oklchInfo.value} to clipboard`}
                    >
                      <span>{oklchInfo.value}</span>
                      {copiedColorIndex === i ? (
                        // Checkmark icon when copied
                        <svg
                          className="w-4 h-4 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        // Copy icon (default state)
                        <svg
                          className="w-4 h-4 transition-opacity opacity-0 group-hover:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm text-left items-center border-t pt-3 mt-2">
                  <span className="font-medium">Lightness:</span>
                  <span className="font-mono">{oklchInfo.l}</span>
                  <span className="font-medium">Chroma:</span>
                  <span className="font-mono">{oklchInfo.c}</span>
                  <span className="font-medium">Hue:</span>
                  <span className="font-mono">{oklchInfo.h}°</span>
                </div> */}

                {/* Always show contrast score in the dialog */}
                {pairsWithSteps && pairsWithSteps.length > 0 && (
                  <div className="pt-3 mt-3 border-t">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-subtle">
                          <th scope="col" className="py-1 pr-2 text-left">
                            Pairs with
                          </th>
                          <th scope="col" className="py-1 text-right">
                            {contrastMethod === 'APCA' &&
                              'Lightness contrast (Lc)'}
                            {contrastMethod === 'WCAG21' && 'Contrast Ratio'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pairsWithSteps.map((contrastReq, colorPairIndex) => {
                          const targetStepIndex = getStepIndex(
                            contrastReq.targetStep,
                          )(PALETTE_STEPS)
                          if (targetStepIndex === -1) return null

                          const contrastArray = contrasts[i]
                          const contrastValue =
                            contrastArray &&
                            colorPairIndex < contrastArray.length
                              ? contrastArray[colorPairIndex]
                              : undefined

                          let isContrastValid = false
                          if (contrastValue !== undefined) {
                            if (contrastMethod === 'APCA') {
                              isContrastValid =
                                parseFloat(String(contrastValue)) >=
                                contrastReq.lc.value
                            } else {
                              isContrastValid =
                                parseFloat(String(contrastValue)) >=
                                contrastReq.wcag.value
                            }
                          }

                          const scoreColor = isContrastValid
                            ? 'text-success-subtle'
                            : 'text-danger-subtle'

                          return (
                            <tr
                              key={`dialog-contrast-${targetStepIndex}`}
                              className="border-b border-neutral-subtle"
                            >
                              <td className="flex items-center gap-2 py-1 pr-2">
                                <div
                                  className="w-3 h-3 border rounded-full border-neutral-subtle"
                                  style={{
                                    backgroundColor: colors[targetStepIndex],
                                  }}
                                />
                                {targetStepIndex + 1}
                              </td>
                              <td className="py-1 text-right">
                                <span className={`font-mono ${scoreColor}`}>
                                  {contrastMethod === 'APCA' &&
                                    contrastValue &&
                                    `${contrastValue} (${contrastReq.lc.value})`}
                                  {contrastMethod === 'WCAG21' &&
                                    contrastValue &&
                                    `${contrastValue}:1 (${contrastReq.wcag.value})`}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </dialog>
              {/* Contrast info in the color cell - only when showContrast is true */}
              {showContrast && (
                <div className="flex flex-col h-full pt-3 print-hide">
                  <ul className="space-y-1">
                    {pairsWithSteps?.map((contrastReq, colorPairIndex) => {
                      const targetStepIndex = getStepIndex(
                        contrastReq.targetStep,
                      )(PALETTE_STEPS)
                      if (targetStepIndex === -1) return null

                      const contrastArray = contrasts[i]
                      const contrastValue =
                        contrastArray && colorPairIndex < contrastArray.length
                          ? contrastArray[colorPairIndex]
                          : undefined
                      let isContrastValid = false

                      if (contrastValue !== undefined) {
                        if (contrastMethod === 'APCA') {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            contrastReq.lc.value
                        } else {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            contrastReq.wcag.value
                        }
                      }

                      const status = isContrastValid ? 'success' : 'danger'
                      const textStatusClassName =
                        getSystemTextColorClassNameForStep({
                          stepIndex: i + 1,
                          status,
                        })
                      return (
                        <li
                          key={`background-pairing-${targetStepIndex}`}
                          className="flex items-center justify-between"
                        >
                          <span>{targetStepIndex + 1}</span>
                          <span>
                            <strong
                              className={'font-mono ' + textStatusClassName}
                            >
                              {contrastMethod === 'APCA' &&
                                contrastValue &&
                                `${contrastValue} (${contrastReq.lc.value})`}
                              {contrastMethod === 'WCAG21' &&
                                contrastValue &&
                                `${contrastValue}:1 (${contrastReq.wcag.value})`}
                            </strong>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function areEqual(prev: ColorScaleProps, next: ColorScaleProps) {
  // Check basic props
  if (
    prev.colorName !== next.colorName ||
    prev.baseColor !== next.baseColor ||
    prev.showContrast !== next.showContrast ||
    prev.contrastMethod !== next.contrastMethod ||
    prev.colors !== next.colors ||
    prev.testId !== next.testId
  ) {
    return false
  }

  // Check anchors - need deep comparison
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

export const ColorScale = React.memo(ColorScaleBase, areEqual)
