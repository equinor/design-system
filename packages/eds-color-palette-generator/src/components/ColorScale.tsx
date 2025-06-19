'use client'
import { colorPairs } from '@/config'
import { checkContrast } from '@/utils/color'
import Color from 'colorjs.io'
import { useState, useEffect, useRef, useMemo } from 'react'

type ColorScaleProps = {
  colors: string[]
  showContrast?: boolean
  contrastMethod?: 'WCAG21' | 'APCA'
  colorName?: string
}

// Type for color information in OKLCH format
type OklchInfo = {
  l: number // lightness
  c: number // chroma
  h: number // hue
  hex: string // original hex value
  index: number // color step index
}

// Function to determine text color for steps
function getTextColorForStep(colors: string[], stepIndex: number): string {
  if (stepIndex >= 7 && stepIndex <= 10) {
    return colors[0] // background color
  }

  if (stepIndex === 11) {
    return 'black' // base color
  }

  if (stepIndex >= 12) {
    return colors[10] // contrast text
  }

  return colors[9] // default text
}

// Convert hex color to OKLCH format
function getOklchInfo(hexColor: string, index: number): OklchInfo {
  try {
    const color = new Color(hexColor)
    const oklch = color.to('oklch')

    return {
      l: parseFloat(oklch.l.toFixed(3)),
      c: parseFloat(oklch.c.toFixed(3)),
      h: parseFloat(oklch.h.toFixed(1)),
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

export function ColorScale({
  colors,
  showContrast = true,
  contrastMethod = 'WCAG21',
  colorName,
}: ColorScaleProps) {
  // State to track the active dialog (index of the color) - only one can be active at a time
  const [activeDialog, setActiveDialog] = useState<number | null>(null)

  // Create refs for dialogs and their corresponding color elements
  const dialogRefs = useRef<(HTMLDialogElement | null)[]>(
    Array(colors.length).fill(null),
  )
  const colorElementRefs = useRef<(HTMLDivElement | null)[]>(
    Array(colors.length).fill(null),
  )

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
      const indexOfBackgroundColorThatPairs = colorPairs[i]?.usedOnStep
      if (!indexOfBackgroundColorThatPairs) return null

      const contrastForAllBackgroundPairings = colorPairs[i]?.usedOnStep?.map(
        (colorPair) => {
          const contrastResult = checkContrast(
            color,
            colors[colorPair.stepIndex],
            contrastMethod,
          )
          return contrastResult
        },
      )
      return contrastForAllBackgroundPairings
    })
  }, [colors, contrastMethod])

  return (
    <div className="mb-8">
      {colorName && (
        <h3
          style={{ color: colors[8] }}
          className={`text-left mb-2 font-medium text-lg`}
        >
          {colorName}
        </h3>
      )}
      <div className="grid gap-3 mb-4 grid-cols-14">
        {colors.map((color: string, i: number) => {
          const textColor = getTextColorForStep(colors, i + 1)
          const pairsWithSteps = colorPairs[i]?.usedOnStep
          const oklchInfo = getOklchInfo(color, i)
          const isDialogActive = activeDialog === i

          return (
            <div
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
                className="min-w-[220px] backdrop:bg-black/20"
                style={{
                  backgroundColor: colors[0],
                  color: colors[9],
                }}
                onClose={handleDialogClose}
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
                <div className="flex justify-between items-center mb-3">
                  <h4
                    id={`color-details-heading-${i}`}
                    className="font-medium text-lg"
                  >
                    {colorName ? `${colorName} #${i + 1}` : `Color #${i + 1}`}
                  </h4>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2"
                    onClick={() => closeDialog(i)}
                    aria-label="Close details"
                  >
                    ✕
                  </button>
                </div>

                {/* Color sample */}
                <div className="flex gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg border"
                    style={{
                      backgroundColor: oklchInfo.hex,
                      borderColor: 'rgba(0,0,0,0.1)',
                    }}
                    aria-label={`Color sample: ${oklchInfo.hex}`}
                  ></div>

                  <div className="flex flex-col justify-center">
                    <div className="font-mono text-base mb-2">
                      {oklchInfo.hex}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm text-left items-center border-t pt-3 mt-2">
                  <span className="font-medium">OKLCH Format:</span>
                  <div className="flex items-center font-mono">
                    oklch({oklchInfo.l} {oklchInfo.c} {oklchInfo.h})
                  </div>
                  <span className="font-medium">Lightness:</span>
                  <span className="font-mono">{oklchInfo.l}</span>
                  <span className="font-medium">Chroma:</span>
                  <span className="font-mono">{oklchInfo.c}</span>
                  <span className="font-medium">Hue:</span>
                  <span className="font-mono">{oklchInfo.h}°</span>
                </div>

                {/* Always show contrast information in the dialog */}
                {pairsWithSteps && pairsWithSteps.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <h5 className="font-medium mb-2">Contrast Information:</h5>
                    <div className="max-h-[120px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-1 pr-2">Color</th>
                            <th className="text-right py-1">
                              {contrastMethod} Contrast
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pairsWithSteps.map((colorPair, colorPairIndex) => {
                            const contrastArray = contrasts[i]
                            const contrastValue =
                              contrastArray &&
                              colorPairIndex < contrastArray.length
                                ? contrastArray[colorPairIndex]?.contrastValue
                                : undefined

                            let isContrastValid = false
                            if (contrastValue !== undefined) {
                              if (contrastMethod === 'APCA') {
                                isContrastValid =
                                  parseFloat(String(contrastValue)) >=
                                  colorPair.lc.value
                              } else {
                                isContrastValid =
                                  parseFloat(String(contrastValue)) >=
                                  colorPair.wcag.value
                              }
                            }

                            const scoreColor = isContrastValid
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-red-500 dark:text-red-400'

                            return (
                              <tr
                                key={`dialog-contrast-${colorPair.stepIndex}`}
                                className="border-b border-gray-100 dark:border-gray-800"
                              >
                                <td className="py-1 pr-2 flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-700"
                                    style={{
                                      backgroundColor:
                                        colors[colorPair.stepIndex],
                                    }}
                                  />
                                  #{colorPair.stepIndex + 1}
                                </td>
                                <td className="text-right py-1">
                                  <span className={`font-mono ${scoreColor}`}>
                                    {contrastMethod === 'APCA' &&
                                      contrastValue &&
                                      `${contrastValue} (${colorPair.lc.value})`}
                                    {contrastMethod === 'WCAG21' &&
                                      contrastValue &&
                                      `${contrastValue}:1 (${colorPair.wcag.value})`}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </dialog>
              {/* Contrast info in the color cell - only when showContrast is true */}
              {showContrast && (
                <div className="flex flex-col h-full pt-3">
                  <ul className="space-y-1 text-[11px]">
                    {pairsWithSteps?.map((colorPair, colorPairIndex) => {
                      const contrastArray = contrasts[i]
                      const contrastValue =
                        contrastArray && colorPairIndex < contrastArray.length
                          ? contrastArray[colorPairIndex]?.contrastValue
                          : undefined
                      let isContrastValid = false

                      if (contrastValue !== undefined) {
                        if (contrastMethod === 'APCA') {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            colorPair.lc.value
                        } else {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            colorPair.wcag.value
                        }
                      }

                      const scoreColor = isContrastValid
                        ? 'text-green-500'
                        : 'text-red-500'
                      return (
                        <li
                          key={`background-pairing-${colorPair.stepIndex}`}
                          className="flex items-center justify-between"
                        >
                          <span>#{colorPair.stepIndex + 1}</span>
                          <span>
                            <strong className={'font-mono ' + scoreColor}>
                              {contrastMethod === 'APCA' &&
                                contrastValue &&
                                `${contrastValue} (${colorPair.lc.value})`}
                              {contrastMethod === 'WCAG21' &&
                                contrastValue &&
                                `${contrastValue}:1 (${colorPair.wcag.value})`}
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
