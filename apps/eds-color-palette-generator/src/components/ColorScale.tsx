'use client'
import { PALETTE_STEPS } from '@/config/config'
import { getStepIndex } from '@/config/helpers'
import { contrast } from '@/utils/color'
import Color from 'colorjs.io'
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useIsMounted } from '@equinor/eds-utils'
import { ColorAnchor } from '@/types'
import { NameAndControls } from './NameAndControls'

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

// Type for color information in OKLCH format
type OklchInfo = {
  l: number // lightness
  c: number // chroma
  h: number // hue
  value: string // original color value
  index: number // color step index
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
      l: parseFloat((oklch.l ?? 0).toFixed(3)),
      c: parseFloat((oklch.c ?? 0).toFixed(3)),
      h: parseFloat((oklch.h == null || isNaN(oklch.h) ? 0 : oklch.h).toFixed(1)),
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

  // Create refs for dialogs
  const dialogRefs = useRef<(HTMLDialogElement | null)[]>(
    Array(colors.length).fill(null),
  )
  const copiedTimeoutRef = useRef<number | null>(null)
  const headingColor = colors[8] || '#000000'

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  // Toggle dialog visibility
  const toggleDialog = useCallback(
    (index: number) => {
      if (activeDialog === index) {
        // Close the dialog if already open
        dialogRefs.current[index]?.close()
        setActiveDialog(null)
      } else {
        // Close any existing dialog first
        if (activeDialog !== null) {
          dialogRefs.current[activeDialog]?.close()
        }

        // Open the new dialog
        dialogRefs.current[index]?.showModal()
        setActiveDialog(index)
      }
    },
    [activeDialog],
  )

  // Close dialog function
  const closeDialog = useCallback((index: number) => {
    dialogRefs.current[index]?.close()
    setActiveDialog(null)
  }, [])

  // Handle dialog closing when it's closed via ESC key
  const handleDialogClose = useCallback(() => {
    setActiveDialog(null)
  }, [])

  // Copy to clipboard function - memoized
  const copyToClipboard = useCallback(
    async (text: string, colorIndex: number) => {
      // Clear any existing timeout
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopiedColorIndex(colorIndex)
        copiedTimeoutRef.current = window.setTimeout(
          () => setCopiedColorIndex(null),
          2000,
        )
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
        copiedTimeoutRef.current = window.setTimeout(
          () => setCopiedColorIndex(null),
          2000,
        )
      }
    },
    [],
  )

  // Effect to handle clicking outside dialog to close it
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
              key={`color-step-${i}`}
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
                  const rect = e.currentTarget.getBoundingClientRect()
                  const isInDialog =
                    rect.top <= e.clientY &&
                    e.clientY <= rect.bottom &&
                    rect.left <= e.clientX &&
                    e.clientX <= rect.right

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
                  />

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

                {/* Contrast scores in dialog */}
                {pairsWithSteps.length > 0 && (
                  <div className="pt-3 mt-3 border-t">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-subtle">
                          <th scope="col" className="py-1 pr-2 text-left">
                            Pairs with
                          </th>
                          <th scope="col" className="py-1 text-right">
                            {contrastMethod === 'APCA'
                              ? 'Lightness contrast (Lc)'
                              : 'Contrast Ratio'}
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
                            const threshold =
                              contrastMethod === 'APCA'
                                ? contrastReq.lc.value
                                : contrastReq.wcag.value
                            isContrastValid =
                              parseFloat(String(contrastValue)) >= threshold
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
                                  {contrastMethod === 'APCA' && contrastValue
                                    ? `${contrastValue} (${contrastReq.lc.value})`
                                    : contrastValue
                                      ? `${contrastValue}:1 (${contrastReq.wcag.value})`
                                      : ''}
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
                    {pairsWithSteps.map((contrastReq, colorPairIndex) => {
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
                        const threshold =
                          contrastMethod === 'APCA'
                            ? contrastReq.lc.value
                            : contrastReq.wcag.value
                        isContrastValid =
                          parseFloat(String(contrastValue)) >= threshold
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
                              className={`font-mono ${textStatusClassName}`}
                            >
                              {contrastMethod === 'APCA' && contrastValue
                                ? `${contrastValue} (${contrastReq.lc.value})`
                                : contrastValue
                                  ? `${contrastValue}:1 (${contrastReq.wcag.value})`
                                  : ''}
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

/**
 * Custom memo comparison function for ColorScale component
 * Note: Callback props are intentionally excluded from comparison.
 * We only care about data changes that would affect the visual output.
 */
function areEqual(prev: ColorScaleProps, next: ColorScaleProps) {
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
