'use client'
import { PALETTE_STEPS } from '@/config/config'
import { getStepIndex } from '@/config/helpers'
import { contrast } from '@/utils/color'
import { Trash, Pencil } from 'lucide-react'
import Color from 'colorjs.io'
import React, { useState, useEffect, useRef, useMemo } from 'react'

type ColorScaleProps = {
  colors: string[]
  showContrast?: boolean
  contrastMethod?: 'WCAG21' | 'APCA'
  colorName?: string
  baseHex?: string
  onRename?: (newName: string) => void
  onChangeHex?: (newHex: string) => void
  onRemove?: () => void
}

// Type for color information in OKLCH format!
type OklchInfo = {
  l: number // lightness
  c: number // chroma
  h: number // hue
  hex: string // original hex value
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

// Convert hex color to OKLCH format
function getOklchInfo(hexColor: string, index: number): OklchInfo {
  try {
    const color = new Color(hexColor)
    const oklch = color.to('oklch')

    return {
      l: parseFloat(oklch.l.toFixed(3)),
      c: parseFloat(oklch.c.toFixed(3)),
      h: parseFloat((isNaN(oklch.h) ? 0 : oklch.h).toFixed(1)),
      hex: hexColor,
      index: index,
    }
  } catch (error) {
    console.error(`Error converting color ${hexColor} to OKLCH:`, error)
    return {
      l: 0,
      c: 0,
      h: 0,
      hex: hexColor,
      index: index,
    }
  }
}

function ColorScaleBase({
  colors,
  showContrast = true,
  contrastMethod = 'WCAG21',
  colorName,
  baseHex,
  onRename,
  onChangeHex,
  onRemove,
}: ColorScaleProps) {
  // State to track client-side rendering for contrast calculations
  const [isClient, setIsClient] = useState(false)

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
        baseHex,
        onRename,
        onChangeHex,
        onRemove,
      }: {
        name?: string
        headingColor: string
        baseHex?: string
        onRename?: (n: string) => void
        onChangeHex?: (h: string) => void
        onRemove?: () => void
      }) {
        const colorInputRef = useRef<HTMLInputElement | null>(null)
        const [localHex, setLocalHex] = useState(baseHex || '#000000')
        const hexDebounceRef = useRef<number | null>(null)

        useEffect(() => {
          setLocalHex(baseHex || '#000000')
        }, [baseHex])

        return (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={name ?? ''}
              onChange={(e) => onRename?.(e.target.value)}
              placeholder="Color name"
              className="min-w-0 max-w-40 flex-1 px-3 py-1.5 rounded-md border border-transparent hover:border-neutral-subtle focus:border-neutral-strong focus:bg-canvas bg-surface text-strong font-medium"
              style={{ color: headingColor }}
              aria-label="Color name"
            />
            <input
              ref={colorInputRef}
              type="color"
              value={localHex}
              onChange={(e) => {
                const next = e.target.value
                setLocalHex(next)
                if (hexDebounceRef.current) {
                  window.clearTimeout(hexDebounceRef.current)
                }
                hexDebounceRef.current = window.setTimeout(() => {
                  onChangeHex?.(next)
                }, 250)
              }}
              className="sr-only"
              aria-label={`Pick base color for ${name ?? 'color'}`}
              tabIndex={-1}
            />
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md  hover:bg-neutral-fill-muted-hover"
              title="Edit base color"
              aria-label="Edit base color"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onRemove?.()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md  border-neutral-subtle hover:bg-neutral-fill-muted-hover"
              title="Remove color"
              aria-label="Remove color"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )
      },
      (prev, next) =>
        prev.name === next.name &&
        prev.baseHex === next.baseHex &&
        prev.headingColor === next.headingColor,
    )
  }, [])

  // Set client-side flag after hydration
  useEffect(() => {
    setIsClient(true)
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
  if (!isClient) {
    return null
  }

  return (
    <div className="mb-8">
      <NameAndControls
        name={colorName}
        headingColor={headingColor}
        baseHex={baseHex}
        onRename={onRename}
        onChangeHex={onChangeHex}
        onRemove={onRemove}
      />
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))`,
        }}
      >
        {colors.map((color: string, i: number) => {
          const textColor = getTextColorForStep(colors, i + 1)
          const step = PALETTE_STEPS[i]
          const pairsWithSteps = step?.contrastWith || []
          const oklchInfo = getOklchInfo(color, i)
          const isDialogActive = activeDialog === i
          const testId = colorName
            ? `${colorName.replace(/\s+/g, '-').toLowerCase()}-${i}`
            : `color-step-${i}`

          return (
            <div
              data-testid={testId}
              key={'color-step-' + i}
              ref={(el) => {
                colorElementRefs.current[i] = el
              }}
              className={`color-scale-item rounded-lg p-3 transition-transform hover:scale-105 relative cursor-pointer ${
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
              aria-label={`Color ${i + 1}: ${oklchInfo.hex}, Click for details`}
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
                      backgroundColor: oklchInfo.hex,
                      borderColor: 'rgba(0,0,0,0.1)',
                    }}
                    aria-label={`Color sample: ${oklchInfo.hex}`}
                  ></div>

                  <div className="flex flex-col justify-center">
                    <button
                      className="mb-2 font-mono text-base text-left hover:bg-black/10 dark:hover:bg-white/10 rounded px-2 py-1 -mx-2 flex items-center gap-2 group"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(oklchInfo.hex, i)
                      }}
                      aria-label={`Copy ${oklchInfo.hex} to clipboard`}
                    >
                      <span>{oklchInfo.hex}</span>
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
                          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                  className="w-3 h-3 border border-neutral-subtle rounded-full"
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
                <div className="flex flex-col h-full pt-3">
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
  return (
    prev.colorName === next.colorName &&
    prev.baseHex === next.baseHex &&
    prev.showContrast === next.showContrast &&
    prev.contrastMethod === next.contrastMethod &&
    prev.colors === next.colors
  )
}

export const ColorScale = React.memo(ColorScaleBase, areEqual)
